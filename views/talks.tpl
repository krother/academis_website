% include('header.tpl', title="Talks")

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>

<h1>Talks</h1>

<hr>

<ul>  
% for title, slug, tag, content in talks:
    <li><a href="#{{ slug }}">{{ title }}</a></li>
% end
</ul>

<hr>

% for title, slug, tag, content in talks:
<a name="{{ slug }}">
<h1>{{ title }}</h1></a>

{{ !content }}

<hr>
% end



</section>
</div>
% include('std_sidebar.tpl')

% include('footer.tpl')

