% include('header.tpl', title=title)

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>
  <h1>{{title}}</h1>
    <ul class="list-content">
    % for title, slug in articles:
    <li><a href="/posts/{{slug}}">{{title}}</a></li>
    % end
    </ul>
</section>

% include('blog_tags.tpl')

</div> 
<!-- endet: WRAPPER PRIMARY -->

% include('std_sidebar.tpl')

% include('footer.tpl')
