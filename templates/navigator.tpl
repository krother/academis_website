<!-- start:  Navigator -->
<nav id="navigator">
  <ul class="list-navigator">
    <li><strong>You are here:</strong></li>
    % for href, name in navi:
    <li><a href="{{ href }}">{{name}}</a></li>
    % end
  </ul>
</nav>
<!-- endet:  Navigator -->
