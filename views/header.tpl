<!doctype html>
<html lang="de">
  <head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon" />

    <meta name="Keywords" content="I want to support scientists manage projects, teach, prepare seminars and prepare lectures, and to do scientific writing efficiently. Academis provides training, workshops, and tutorials in these subjects. I'll be happy to help you create better science.">
    
    <meta name="Description" content="Communicate science better">
       
    <meta name="Distribution" content="Global">
    <meta name="Robots" content="index,follow">
    <meta name="author" content="Dr. Kristian Rother">

    <!-- start: CSS Block -->
      <!-- css@normalize -->
      <link rel="stylesheet" href="/static/css/module_normalize.css">
      <!-- css@master -->
      <link rel="stylesheet" href="/static/css/integrated.css">
      <!-- css@google fonts -->
      <link href='https://fonts.googleapis.com/css?family=Lato:400,300,700,300italic,400italic,700italic' rel='stylesheet' type='text/css'>
      <!-- css@fontawesome.io für icons -->
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">
      <link rel="stylesheet" href="/static/css/pygments_default.css">
    <!-- endet: CSS Block -->

    <!-- start: Seitentitel -->
    <title>Academis • {{title}}</title>
    <!-- endet: Seitentitel -->
  </head>
  
<body>

<!-- start: Headerbereich -->
<div id="row" class="top">
    <div id="wrapper-master">
        <header>
            <img src="/static/images/academis_kr350.png" alt="Academis" class="media-logo" />
        </header>
    </div>
</div>
<!-- endet: Headerbereich -->
<div id="wrapper-master" class="group">

<!-- start:  Navigator -->
<nav id="navigator">
  <ul class="list-navigator">
    <li><strong>You are here:</strong></li>
    % for href, name in navi:
    <li><a href="{{ href }}">{{name}}</a></li>
    % end
  </ul>
</nav>
<!-- endet:  Navigator -->

