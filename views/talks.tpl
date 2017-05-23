% include('header.tpl', title="Talks")

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>

<h1>Talks</h1>

<hr>

% for title, tag, content in talks:
  <ul class="list-spectre">  
    <li class="{{ tag }}"><h1>{{ title }}</h1>
</ul>

{{ !content }}

<hr>

% end

</section>
</div>
% include('std_sidebar.tpl')

% include('footer.tpl')

