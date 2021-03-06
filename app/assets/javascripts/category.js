$(document).on('turbolinks:load', function() {
  function options(category){ // option生成
    let html = `<option value="${category.id}" data-category="${category.id}">${category.name}</option>`;
    return html;
  }
  // 子カテゴリー用html
  function childrenBox(buildHTML){
    let childSelectHtml = '';
    childSelectHtml = `<select class='ex__detail__category__box--select select' id='child-form' name = 'item[category_id]'>
                        <option value="選択してください" data-category="選択してください">選択してください</option>
                          ${buildHTML}
                        <select>`;
    $('.ex__detail__category__box').append(childSelectHtml);
  }
  // 孫カテゴリー用html
  function grandchildrenBox(buildHTML){
    let grandchildSelectHtml = '';
    grandchildSelectHtml = `<select class='ex__detail__category__box--select select' id='grandchild-form' name = 'item[category_id]'>
                              <option value="選択してください" data-category="選択してください">選択してください</option>
                                ${buildHTML}
                              <select>`;
    $('.ex__detail__category__box').append(grandchildSelectHtml);
  }

  //親カテゴリー選択時イベント
  $('#parent-form').on("change", function() {
    let parentId = document.getElementById('parent-form').value;
    if (parentId != '選択してください') { //親の値が初期値でない時
      $.ajax({ //ajax通信
        url: '/items/:item_id/category_children',
        type: 'GET',
        data: {
          parent_id: parentId
        },
        dataType: 'json'
      })
      //成功時
      .done(function(children){
        $('#child-form').remove(); // 子を削除
        $('#grandchild-form').remove(); // 孫を削除
        let buildHTML = '';
        children.forEach(function(child){
          buildHTML += options(child);
        });
        childrenBox(buildHTML);
      })
      .fail(function() {
        alert('カテゴリー取得に失敗しました');
      })
    }else{ // 親が初期値の時
      $('#child-form').remove(); 
      $('#grandchild-form').remove();
    }
  });

  // 子カテゴリー選択時
  $(document).on('change', '#child-form', function(){
    let childId = document.getElementById('child-form').value;
    if (childId != '選択してください'){ //子カテゴリーが初期値でない時
      $.ajax({
        url: '/items/:item_id/category_grandchildren',
        type: 'GET',
        data: { child_id: childId },
        dataType: 'json'
      })
      .done(function(grandchildren){
        $('#grandchild-form').remove();
        let buildHTML = '';
        grandchildren.forEach(function(grandchild){
          buildHTML += options(grandchild);
        });
        grandchildrenBox(buildHTML);
      })
      .fail(function(){
        alert('カテゴリー取得に失敗しました');
      })
    }else{
      $('#grandchild-form').remove();
    }
  });
});
