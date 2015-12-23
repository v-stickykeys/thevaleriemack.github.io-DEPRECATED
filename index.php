<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<title>Val Mack</title>
	<link rel="stylesheet" href="css/main.css?v=1" type="text/css">
	<link rel="stylesheet" href="css/semantic.min.css?v=1" type="text/css">
	<script src="js/jquery-2.1.4.min.js" type="text/javascript"></script>
	<script src="js/semantic.min.js" type="text/javascript"></script>
	<script src="js/script.js" type="text/javascript"></script>
</head>
<body>

	<div class="ui text container vertical segment">
  <div class="ui left rail">
    <!-- <div class="ui segment">
      <section id="section1">
			<h1>Val</h1>
			<h2>Denay</h2>
			<h1>Mack</h1>
		</section>
		<section id="section2">
			Contact
		</section>
		<section id="section3">
			Links
		</section>
    </div>
  </div> -->

<div class="ui borderless vertical menu">
  <a class="item active disabled">
    <h1 class="ui header">Val</h1>
    <h2>Denay</h2>
    <h1>Mack</h1>
  </a>
  <a class="item disabled">
    <h4 class="ui header">Contact</h4>
    <p>Check out our collection of coupons</p>
  </a>
  <a class="item disabled">
    <h4 class="ui header">Links</h4>
    <p>Visit our rebate forum for information on claiming rebates</p>
  </a>
</div>
</div>

	<div class="ui basic segment">
		<h4 class="ui horizontal divider header">
  <i class="tag icon"></i>
  Projects
</h4>
		<?php include 'includes/projects.php';?>
	</div>

	<div class="ui basic segment">

		<h4 class="ui horizontal divider header">
  <i class="tag icon"></i>
  Skills
</h4>
		<?php include 'includes/skills.php';?>
	</div>

	<div class="ui basic segment">
		<h4 class="ui horizontal divider header">
  <i class="tag icon"></i>
  Resume
</h4>
		<?php include 'includes/resume.php';?>
	</div>

</div>
</body>
</html>