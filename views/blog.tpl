% include('header.tpl', title="Academis Dr. Kristian Rother")

  <div class="container-narrow">

    <p></p>

<div class="row-fluid marketing">
<div class="span12">

<h1>Academis Blog</h1>

% include('blog_topics.tpl')

<h3><a href="/blog_list">List of all blog posts</a></h3>

<h3>Tags:</h3>
<ul>
  % for tag in tags:
  <li><a href="/blog/tags/{{tag}}">{{tag}}</a></li>
  % end
</ul>

&nbsp;
&nbsp;

</div></div>

    <p></p>

    </div> <!-- /container -->

% include('footer.tpl')









