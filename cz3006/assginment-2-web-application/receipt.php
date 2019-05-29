<?php 
// Redirect user back to index page if no values are posted
if (!isset($_POST)) {
  echo ("<script type=\"javascript\">window.location='index.php'</script>");
}

$costSettings = array("apple" => 69, "orange" => 59, "banana" => 39);

$filename = "order.txt";

// Read accumulated numbers
$file = fopen( $filename, "r");

if( $file == false ) {
  echo ( "Error in opening new file" );
  exit();
}

$numbers = array();
while(!feof($file)) {
  $line = fgets($file);
  array_push($numbers, (int) filter_var($line, FILTER_SANITIZE_NUMBER_INT));
}

// Map the new costs to the accumulated cost values from the text file
$fruits = $_POST;
$i = 0;
foreach ($costSettings as $fruit => $cost) {
  $fruits[$fruit] = $fruits[$fruit] + $numbers[$i];
  $i++;
}

fclose( $file );

// Update the costs to the text file
$file = fopen( $filename, "w" );
   
foreach ($costSettings as $fruit => $cost) {
  $contents .= "Total number of ".$fruit."s: ".$fruits[$fruit]."\n";
}

fwrite( $file, $contents);
fclose( $file );
?>

<html>

<head>
    <meta charset="UTF-8">
    <title>Freshest Fruit eMarket - receipt</title>
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container">
        <h3 class="text-center">Receipt</h3>

        <p>Dear <?php echo ($_POST["customerName"]) ?>, here is your receipt:</p>
        <table class="table table-borderless receipt-table">
          <thead>
            <th>Item</th>
            <th>U.P.</th>
            <th>Qty</th>
            <th class="text-right">Price</th>
          </thead>
          <tbody>
            <?php 
            $totalCost = 0;

            foreach ($costSettings as $fruit => $cost) {
              $subTotal = $_POST[$fruit] * $cost;
              if($_POST[$fruit] > 0) {
            ?>
            <tr>
                <th><?php echo ($fruit) ?></th>
                <td>$<?php echo ($costSettings["fruit"]) ?></td>
                <td><?php echo ($_POST[$fruit]) ?></td>
                <td class="text-right">$<?php echo ($subTotal) ?></td>
            </tr>
            <?php
              }
              $totalCost += $_POST[$fruit] * $cost;
            }
            ?>
            <tr>
              <td class="text-right" colspan="3">Total:</td>
              <td class="text-right total-col">$<?php echo ($totalCost) ?></td>
            </tr>
            <tr class="total-row">
              <td class="text-right" colspan="3">Payment Method:</td>
              <td><?php echo ($_POST["paymentMethod"]) ?></td>
            </tr>
          </tbody>
        </table>
        <p>Thank you for shopping at Freshest Fruit eMarket, we hope to see you again!</p>
    </div>
</body>

</html> 