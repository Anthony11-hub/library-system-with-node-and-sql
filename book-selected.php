<?php
session_start();
error_reporting(0);
include('includes/config.php');
if(strlen($_SESSION['login'])==0)
    {   
header('location:index.php');
}
else{ 

if(isset($_POST['update']))
{
$bookImage=$_POST['bookImage'];
$bookname=$_POST['bookname'];
$category=$_POST['category'];
$author=$_POST['author'];
$isbn=$_POST['isbn'];
$price=$_POST['price'];
$bookid=intval($_GET['bookid']);
$keywords=$_POST['keywords'];


}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="assets/css/recommends.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <link rel="stylesheet" href="assets/css/recommends.css">
    <title>Document</title>
</head>
<body>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">Library Management System</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active">
        <a class="nav-link" href="dashboard.php">Dashboard <span class="sr-only">(current)</span></a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="issued-books.php">My Books</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="my-profile.php">Profile</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="change-password.php">Change Password</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="logout.php">Logout</a>
      </li>
    </ul>
  </div>
</nav>

<?php 
$bookid=intval($_GET['bookid']);
$sql = "SELECT tblbooks.BookName,tblcategory.CategoryName,tblcategory.id as cid,tblauthors.AuthorName,tblauthors.id as athrid,tblbooks.ISBNNumber,tblbooks.BookPrice,tblbooks.id as bookid,tblbooks.bookImage,tblbooks.isIssued, tblbooks.Status, tblbooks.Link from  tblbooks join tblcategory on tblcategory.id=tblbooks.CatId join tblauthors on tblauthors.id=tblbooks.AuthorId where tblbooks.id=:bookid";
$query = $dbh -> prepare($sql);
$query->bindParam(':bookid',$bookid,PDO::PARAM_STR);
$query->execute();
$results=$query->fetchAll(PDO::FETCH_OBJ);
$cnt=1;
if($query->rowCount() > 0)
{
foreach($results as $result)
{               ?>  

  <!-- About Start -->
  <div class="container-fluid py-5" id="about">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-5 pb-4 pb-lg-0">
                <img class="img-fluid rounded w-100" src="bookimg/<?php echo htmlentities($result->bookImage);?>" width="100" alt="book image">
            </div>
            <div class="col-lg-7">
                <h3 class="mb-4">Book Decription</h3>
                <p><?php echo htmlentities($result->BookPrice);?>.</p>
                <div class="row mb-3">
                    <div class="col-sm-6 py-2"><h6>Book Name: <span class="text-secondary"><?php echo htmlentities($result->BookName);?></span></h6></div>
                    <div class="col-sm-6 py-2"><h6>Author: <span class="text-secondary"><?php echo htmlentities($athrname=$result->AuthorName);?></span></h6></div>
                    <div class="col-sm-6 py-2"><h6>Category: <span class="text-secondary"><?php echo htmlentities($catname=$result->CategoryName);?></span></h6></div>
                    <!-- <div class="col-sm-6 py-2"><h6>Experience: <span class="text-secondary">Not yet</span></h6></div> -->
                    <div class="col-sm-6 py-2"><h6>ISBN: <span class="text-secondary"><?php echo htmlentities($result->ISBNNumber);?></span></h6></div>
                    <?php if($result->isIssued=='1'): ?>
                    <div class="col-sm-6 py-2" style="color:red;"><h6>Availability: <span class="text-secondary">Book Issued</span></h6></div>
                    <?php endif;?>
                   
                    <!-- <div class="col-sm-6 py-2"><h6>Address: <span class="text-secondary">Nairobi, Kenya</span></h6></div>
                    <div class="col-sm-6 py-2"><h6>Freelance: <span class="text-secondary">Available</span></h6></div>  -->
                </div>
                <?php }} ?>
                  
                <?php if($result->Status=='1'): ?>
                  <a href="<?php echo htmlentities($result->Link);?>" class="btn blue btn-outline-primary mr-4">Read Book</a>
                <?php endif;?>  
                <a href="request-book.php" class="btn blue btn-outline-primary mr-4">Request Book</a>
            </div>
        </div>
    </div>
</div>



<div class="reco">
  <h2>Other book in this field</h2>

<div class="slider-container">

  <div class="slider">
    <div class="slides">
      <div id="slides__1" class="slide">
      <?php 
      $bookid=intval($_GET['bookid']);
      $sql = "SELECT tblcategory.CategoryName,tblauthors.AuthorName,tblbooks.id as bookid,tblbooks.bookImage from  tblbooks join tblcategory on tblcategory.id=tblbooks.CatId join tblauthors on tblauthors.id=tblbooks.AuthorId join tblkeywords on tblkeywords.id=tblcategory.id LIMIT 5 ";
      $query = $dbh -> prepare($sql);
      $query->execute();
      $results=$query->fetchAll(PDO::FETCH_OBJ);
      $cnt=1;
      if($query->rowCount() > 0)
      {
      foreach($results as $result)
      {               ?> 
      <div class="card">
        <img src="bookimg/<?php echo htmlentities($result->bookImage);?>" alt="John" style="width:100%">
        <h1 class="title"><?php echo htmlentities($result->AuthorName);?></h1>
        <p class="title"><?php echo htmlentities($result->CategoryName);?></p>
        <a href="#"><i class="fa fa-dribbble"></i></a>
        <a href="#"><i class="fa fa-twitter"></i></a>
        <a href="#"><i class="fa fa-linkedin"></i></a>
        <a href="#"><i class="fa fa-facebook"></i></a>
        <a href="book-selected.php?bookid=<?php echo htmlentities($result->bookid);?>">View this book</a>
        <!-- <p><button>View This Book</button></p> -->
      </div>
      <?php $cnt=$cnt+1;}} ?>                      
        <a class="slide__prev" href="#slides__4" title="Next"></a>
        <a class="slide__next" href="#slides__2" title="Next"></a>
      </div>
      <div id="slides__2" class="slide">
        <span class="slide__text">2</span>
        <a class="slide__prev" href="#slides__1" title="Prev"></a>
        <a class="slide__next" href="#slides__3" title="Next"></a>
      </div>
      <div id="slides__3" class="slide">
        <span class="slide__text">3</span>
        <a class="slide__prev" href="#slides__2" title="Prev"></a>
        <a class="slide__next" href="#slides__4" title="Next"></a>
      </div>
      <div id="slides__4" class="slide">
        <span class="slide__text">4</span>
        <a class="slide__prev" href="#slides__3" title="Prev"></a>
        <a class="slide__next" href="#slides__1" title="Prev"></a>
      </div>
    </div>
  </div>
</div>
</div>
<footer>
  <h2>Library Management System</h2>
</footer>

</body>
</html>
<?php } ?>