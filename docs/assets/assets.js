var titleBr = document.getElementsByTagName("title")[0].innerHTML;
window.onload = function(){
    document.getElementById('title').innerHTML = titleBr;
};
src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
document.getElementById("searchFilter").addEventListener("keyup", (filt) => {
if (filt.code === "Enter")  {var query = document.getElementById("searchFilter").value;
  var fo = window.find(query);
  var x = fo.position();
  document.getElementById("contentNew").scrollTo({
    top: x.top,
    left: 0,
    behavior: 'smooth'
  });

}
});
