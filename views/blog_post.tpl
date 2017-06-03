% include('header.tpl', title=title)

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>
    {{!text}}
</section>
% if license=="CC-BY-SA-4.0":
<section>
<hr>
<p>(c) 2017 Kristian Rother<br>
<b>This article is published under the Creative Commons Attribution Share-alike License 4.0</b>
</p>
<p>
<i>(you may copy, modify and share it, given that you attribute the author(s) and publish it under the same license.<br>
See <a href="http://creativecommons.org/">www.creativecommons.org/</a> for details.)</i>
</p>
</section>
% end
</div> 
<!-- endet: WRAPPER PRIMARY -->

<!-- start: WRAPPER SECONDARY -->
<div id="wrapper-secondary">
% include('blog_icon_block.tpl')
% include('blog_tags.tpl')
% include('toc.tpl')
</div>
<!-- endet: WRAPPER SECONDARY -->

% include('footer.tpl')
