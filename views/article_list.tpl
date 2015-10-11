% include('header.tpl', title=title)

  <div class="container-narrow">

    <p></p>

<div class="row-fluid marketing">
<div class="span12">

    <h1>{{title}}</h1>

    % for title, slug in articles:
    <li><p><a href="/posts/{{slug}}">{{title}}</a></p></li>
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
