% include('header.tpl', title="Courses")

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>

<h1>Testimonials</h1>

% for testimonial in testimonials:
<p>
  <strong>{{ !testimonial[0] }}</strong><br>
  <em>({{ !testimonial[1] }})</em>
</p>
% end


</section>
</div>
% include('std_sidebar.tpl')

% include('footer.tpl')

