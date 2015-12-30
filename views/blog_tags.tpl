
<section>
  <h2>Tags</h2>
  <ul class="list-tags">
  % for tag, slug in tags:
  <li><a href="/blog/tags/{{slug}}">{{tag}}</a></li>
  % end
  </ul>
</section>
