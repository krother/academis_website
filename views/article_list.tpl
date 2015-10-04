% include('views/header.tpl', title="Academis Article")

  <div class="container-narrow">

    <p></p>

<div class="row-fluid marketing">
<div class="span12">

    <h1>Academis Blog</h1>

    % for title, link in articles:
    <li><a href="/posts/{{link}}">{{title}}</a></li>
    % end

&nbsp;
&nbsp;

</div></div>

    <p></p>

    </div> <!-- /container -->

% include('views/footer.tpl')
