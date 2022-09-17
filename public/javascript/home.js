$(document).ready(()=>{
    $.get("/api/posts",{followingOnly:true},(results)=>{
      outputPosts(results,$(".postsContainer"));
    })
})

function outputPosts(results,container){
    container.html("");
    results.forEach(element => {
        var html = createPostHtml(element);
        container.append(html);
    });

    if(results.length===0){
        container.append("<span class='noResults'>Nothing to show here</span>")
    }
}