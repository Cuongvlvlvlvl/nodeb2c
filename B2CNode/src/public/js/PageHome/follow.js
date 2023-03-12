var btnFollow = document.querySelectorAll('.item_book_icon_follow');
var btnFollow_Length = btnFollow.length;

{/* <i class="fa-solid fa-bookmark"></i> fa-regular fa-bookmark */}
for(var i = 0; i < btnFollow_Length; i++){        
    btnFollow[i].onclick = function(){
        if(this.classList.contains('fa-regular')){
            this.classList.remove('fa-regular')
            this.classList.add('fa-solid');
        }
        else{
            this.classList.remove('fa-solid');
            this.classList.add('fa-regular')
        }
    }
}