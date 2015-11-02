<h3><a href="/blog_list">List of all blog posts</a></h3>

<hr>

<h3>Tags:</h3>
<ul class="list-tags">
  % for tag, slug in tags:
  <li><p><a href="/blog/tags/{{slug}}">{{tag}}</a></p></li>
  % end
</ul>
