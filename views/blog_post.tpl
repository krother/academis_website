% include('header.tpl', title=title)

<!-- start: WRAPPER PRIMARY -->
<div id="wrapper-primary">
<section>
    {{!text}}
</section>
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
