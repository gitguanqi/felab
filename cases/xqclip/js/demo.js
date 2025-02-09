/*
 * @Author: fegq
 * @Date: 2021-09-29 14:17:50
 * @LastEditors: fegq
 * @LastEditTime: 2021-09-29 14:24:39
 * @Description: This is a file comment!
 * @Version: 
 */
let clip = new XqClip({
    box: '.corp',
    boxWin: 300,
    boxHei: 300,
    url: './img/a1.jpg',
    pre: '#preview-img',
    scale: 16/16,
    showPos: true,
    scaleImg: true,
});

let downloadBtn = document.getElementById('download');
let changeBtn = document.getElementById('change');
let previewImg = document.getElementById('preview-img');
downloadBtn.onclick = function () {  
    if (previewImg.src == '') return;
    this.href = previewImg.src;
    this.download = new Date().getTime();
}

changeBtn.addEventListener('click', function () {
    clip.replaceImg('./img/a2.png');
})