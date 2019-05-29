
/*===============================================================*
 *  File: SWP.java                                               *
 *                                                               *
 *  This class implements the sliding window protocol            *
 *  Used by VMach class					         *
 *  Uses the following classes: SWE, Packet, PFrame, PEvent,     *
 *                                                               *
 *  Author: Professor SUN Chengzheng                             *
 *          School of Computer Engineering                       *
 *          Nanyang Technological University                     *
 *          Singapore 639798                                     *
 *===============================================================*/
import java.util.Timer;
import java.util.TimerTask;

public class SWP {

   /*
    * ========================================================================* the
    * following are provided, do not change them!!
    * ========================================================================
    */
   // the following are protocol constants.
   public static final int MAX_SEQ = 7;
   public static final int NR_BUFS = (MAX_SEQ + 1) / 2;

   // the following are protocol variables
   private int oldest_frame = 0;
   private PEvent event = new PEvent();
   private Packet out_buf[] = new Packet[NR_BUFS];

   // the following are used for simulation purpose only
   private SWE swe = null;
   private String sid = null;

   // Constructor
   public SWP(SWE sw, String s) {
      swe = sw;
      sid = s;
   }

   // the following methods are all protocol related
   private void init() {
      for (int i = 0; i < NR_BUFS; i++) {
         out_buf[i] = new Packet();
      }
   }

   private void wait_for_event(PEvent e) {
      swe.wait_for_event(e); // may be blocked
      oldest_frame = e.seq; // set timeout frame seq
   }

   private void enable_network_layer(int nr_of_bufs) {
      // network layer is permitted to send if credit is available
      swe.grant_credit(nr_of_bufs);
   }

   private void from_network_layer(Packet p) {
      swe.from_network_layer(p);
   }

   private void to_network_layer(Packet packet) {
      swe.to_network_layer(packet);
   }

   private void to_physical_layer(PFrame fm) {
      System.out.println("SWP: Sending frame: seq = " + fm.seq + " ack = " + fm.ack + " kind = " + PFrame.KIND[fm.kind]
            + " info = " + fm.info.data);
      System.out.flush();
      swe.to_physical_layer(fm);
   }

   private void from_physical_layer(PFrame fm) {
      PFrame fm1 = swe.from_physical_layer();
      fm.kind = fm1.kind;
      fm.seq = fm1.seq;
      fm.ack = fm1.ack;
      fm.info = fm1.info;
   }

   /*
    * ===========================================================================*
    * implement your Protocol Variables and Methods below:
    * ==========================================================================
    */
   private Packet in_buf[] = new Packet[NR_BUFS];
   static boolean no_nak = true; // no nak has been sent yet
   static boolean between(int a, int b, int c) {
      // same as between in protocol5, but shorter and more obscure
      return ((a <= b) && (b < c)) || ((c < a) && (a <= b)) || ((b < c) && (c < a));
   }

   private void send_frame(int frame_kind, int frame_nr, int frame_expected, Packet buffer[]) {
      // Construct and send a data, ack, or nak frame
      PFrame s = new PFrame(); // scratch variable
      s.kind = frame_kind; // kind == data, ack, or nak
      if (frame_kind == PFrame.DATA) {
         s.info = buffer[frame_nr % NR_BUFS];
      }
      s.seq = frame_nr; // only meaningful for data frames
      s.ack = (frame_expected + MAX_SEQ) % (MAX_SEQ + 1);
      if (frame_kind == PFrame.NAK) { // one nak per frame
         no_nak = false;
      }
      to_physical_layer(s); // transmit the frame
      if (frame_kind == PFrame.DATA) {
         start_timer(frame_nr % NR_BUFS);
      }
      stop_ack_timer(); // no need for separate ack frame
   }

   int inc(int seq) {
      // circular increment
      return (seq + 1) % (MAX_SEQ + 1);
   }

   public void protocol6() {
      int ack_expected = 0;         // lower edge of sender's window
      int next_frame_to_send = 0;   // upper edge of sender's window
      int frame_expected = 0;       // lower edge of receiver's window
      int too_far = NR_BUFS;        // upper edge of receiver's window
      int i;                        // index into buffer pool

      PFrame received_frame = new PFrame();                  // scratch variable
      Packet in_buf[] = new Packet[NR_BUFS];    // buffers for the inbound stream
      boolean arrived[] = new boolean[NR_BUFS]; // inbound bit map

      enable_network_layer(NR_BUFS); // initialize

      init();
      
      for (i = 0; i < NR_BUFS; i++) {
         arrived[i] = false;
         in_buf[i] = new Packet();
      }

      while (true) {
         wait_for_event(event);
         switch (event.type) { // five possibilities: NETWORK_LAYER_READY, FRAME_ARRIVAL, CKSUM_ERR, TIMEOUT,
                               // ACK_TIMEOUT
         case (PEvent.NETWORK_LAYER_READY): // accept, save, and transmit a new frame
            from_network_layer(out_buf[next_frame_to_send % NR_BUFS]); // fetch new packet
            send_frame(PFrame.DATA, next_frame_to_send, frame_expected, out_buf); // transmit the frame
            next_frame_to_send = inc(next_frame_to_send); // advance upper window edge
            break;
         case (PEvent.FRAME_ARRIVAL): // a data or control frame has arrived
            from_physical_layer(received_frame); // fetch incoming frame from physical layer
            if (received_frame.kind == PFrame.DATA) {
               // An undamaged frame has arrived
               if (received_frame.seq != frame_expected && no_nak) {
                  send_frame(PFrame.NAK, 0, frame_expected, out_buf);
               } else {
                  start_ack_timer();
               }
               if (between(frame_expected, received_frame.seq, too_far) && !arrived[received_frame.seq % NR_BUFS]) {
                  // frames may be accepted in any order
                  arrived[received_frame.seq % NR_BUFS] = true; // mark buffer as full
                  in_buf[received_frame.seq % NR_BUFS] = received_frame.info; // insert data into buffer
                  while (arrived[frame_expected % NR_BUFS]) {
                     // Pass frames and advance window
                     to_network_layer(in_buf[frame_expected % NR_BUFS]);
                     no_nak = true;
                     arrived[frame_expected % NR_BUFS] = false;
                     frame_expected = inc(frame_expected); // advance lower edge of receiver's window
                     too_far = inc(too_far); // advance upper edge of receiver's window
                     start_ack_timer();
                  }
               }
            }
            if ((received_frame.kind == PFrame.NAK) && between(ack_expected, (received_frame.ack + 1) % (MAX_SEQ + 1), next_frame_to_send)) {
               send_frame(PFrame.DATA, (received_frame.ack + 1) % (MAX_SEQ + 1), frame_expected, out_buf);
            }
            while (between(ack_expected, received_frame.ack, next_frame_to_send)) {
               stop_timer(ack_expected % NR_BUFS); // frame arrived intact
               ack_expected = inc(ack_expected);	// Advance lower edge of sender's window
               enable_network_layer(1);	// Suspect losing frame is frame is not in order
            }
            break;
         case (PEvent.CKSUM_ERR):
            if (no_nak) {
               send_frame(PFrame.NAK, 0, frame_expected, out_buf); // damaged frame
            }
            break;
         case (PEvent.TIMEOUT):
            send_frame(PFrame.DATA, oldest_frame, frame_expected, out_buf);
            break;
         case (PEvent.ACK_TIMEOUT):
            send_frame(PFrame.ACK, 0, frame_expected, out_buf);
            break;
         default:
            System.out.println("SWP: undefined event type = " + event.type);
            System.out.flush();
         }
      }
   }

   /*
    * Note: when start_timer() and stop_timer() are called, the "seq" parameter
    * must be the sequence number, rather than the index of the timer array, of the
    * frame associated with this timer,
    */

   private Timer[] timer = new Timer[NR_BUFS]; // timer
   private Timer ackTimer = new Timer(); // ack timer

   public class FrameTimeoutTask extends TimerTask {
      int seq;

      public FrameTimeoutTask(int seq) {
         this.seq = seq;
      }

      public void run() {
         swe.generate_timeout_event(seq);
      }
   }

   private void start_timer(int seq) {
      stop_timer(seq);
      timer[seq % NR_BUFS] = new Timer();
      timer[seq % NR_BUFS].schedule(new FrameTimeoutTask(seq), 300);
   }

   private void stop_timer(int seq) {
      if (timer[seq % NR_BUFS] != null) {
         timer[seq % NR_BUFS].cancel();
         timer[seq % NR_BUFS] = null;
      }
   }

   public class AckTimeoutTask extends TimerTask {
      public void run() {
         swe.generate_acktimeout_event();
      }
   }

   private void start_ack_timer() {
      stop_ack_timer();
      ackTimer = new Timer();
      ackTimer.schedule(new AckTimeoutTask(), 100);
   }

   private void stop_ack_timer() {
      if (ackTimer != null) {
         ackTimer.cancel();
         ackTimer = null;
      }
   }

}// End of class

/*
 * Note: In class SWE, the following two public methods are available: .
 * generate_acktimeout_event() and . generate_timeout_event(seqnr).
 * 
 * To call these two methods (for implementing timers), the "swe" object should
 * be referred as follows: swe.generate_acktimeout_event(), or
 * swe.generate_timeout_event(seqnr).
 */
