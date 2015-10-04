% include('header.tpl', title="Academis Article")

  <div class="container-narrow">

    <p></p>

<div class="row-fluid marketing">
<div class="span12">

    <h1>Academis Blog</h1>

    % for title, link in articles:
    <li><p><a href="/posts/{{link}}">{{title}}</a></p></li>
    % end


<hr>

% include('blog_icon_block.tpl')

<hr>

% include('blog_tags.tpl')

&nbsp;
&nbsp;

</div></div>

    <p></p>

    </div> <!-- /container -->

% include('footer.tpl')
