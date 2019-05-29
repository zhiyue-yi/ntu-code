<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Freshest Fruit eMarket - catalog</title>
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap-grid.min.css">
    <link rel="stylesheet" href="vendor/bootstrap-4.1.3-dist/css/bootstrap-reboot.min.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="container">
        <h4>Freshest Fruit eMarket</h4>
        <form action="receipt.php" method="post">
            <div class="form-group">
                <label for="customerName">Your name</label>
                <input name="customerName" type="text" class="form-control" id="customerName" placeholder="Enter your name">
            </div>
            <div class="form-group">
                <label for="apple">No. of Apples</label>
                <input name="apple" type="text" class="form-control fruitInput" id="apple" placeholder="Enter a number">
            </div>

            <div class="form-group">
                <label for="orange">No. of Oranges</label>
                <input name="orange" type="text" class="form-control fruitInput" id="orange" placeholder="Enter a number">
            </div>

            <div class="form-group">
                <label for="banana">No. of Bananas</label>
                <input name="banana" type="text" class="form-control fruitInput" id="banana" placeholder="Enter a number">
            </div>

            <div class="form-group">
                <label for="totalCost">Total Cost</label>
                <input type="text" class="form-control" id="totalCost" onfocus="this.blur()">
            </div>

            <div>
                Select a Payment Method:
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="paymentMethod" id="paymentMethodVisa" value="Visa">
                <label class="form-check-label" for="paymentMethodVisa">
                    Visa
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="paymentMethod" id="paymentMethodMasterCard" value="MasterCard">
                <label class="form-check-label" for="paymentMethodMasterCard">
                    MasterCard
                </label>
            </div>

            <div class="form-check">
                <input class="form-check-input" type="radio" name="paymentMethod" id="paymentMethodDiscover" value="Discover">
                <label class="form-check-label" for="paymentMethodDiscover">
                    Discover
                </label>
            </div>

            <div class="form-group mt-4">
                <button id="submitBtn" class="btn btn-primary w-100" type="submit" disabled>Submit</button>
            </div>
        </form>
    </div>

    <script src="script.js"></script>
</body>

</html> 