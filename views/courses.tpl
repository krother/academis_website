% include('header.tpl', title="Courses")

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>

<h1>Courses</h1>

<ul>  
% for title, slug, tag, content in courses:
    <li><a href="#{{ slug }}">{{ title }}</a></li>
% end
</ul>

<hr>

% for title, slug, tag, content in courses:
<a name="{{ slug }}">
<h1>{{ title }}</h1></a>

{{ !content }}

<hr>
% end

<ul class="list-spectre">  
    <li class="teaching"><h3>Other Course Topics</h3>
    <p></p></li>
</ul>

     <ul>
     <li>Leadership for Software Developers</li>
     <li>Software Engineering Fundamentals</li>
     <li>Introduction to Scrum</li>
     <li>Python for Biologists</li>
     <li>Introduction to MongoDB</li>
     <li>Introduction to Apache Solr</li>
     <li>Introduction to PostGreSQL</li>
     <li>Version Control with Git</li>
     <li>Version Control with Mercurial</li>
    </ul>

<!--     <div class="row">
      <div class="col-md-6">
    <table class="table table-striped table-bordered">
     <tbody><tr><th>Title</th><th>Duration [days]</th></tr>
     <tr><td>Leadership for Software Developers</td><td>2</td></tr>
     <tr><td>Software Engineering Fundamentals</td><td>2</td></tr>
     <tr><td>Version Control with Mercurial</td><td>1</td></tr>
    </tbody></table>
    </div></div> !-->

    <p>I am happy to customize course content and duration to your needs. <br>You can choose the training language among English, German or Polish. <br>Discounts for multiple days / bookings are available.</p>
    
</section>
</div>
% include('std_sidebar.tpl')

% include('footer.tpl')

