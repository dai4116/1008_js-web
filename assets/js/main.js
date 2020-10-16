var pagePopular = ''
var page = ''
// Ajax
async function ajaxSend (type, fileName) {
  return $.ajax({
    url: `/assets/json/${fileName}.json`,
    type: type,
    dataType: 'json' //返回資料格式為json
  });
}

//每個頁面都有廣告圖
function init () {
    //繪出a區banner
    let bannerHtml = []
    ajaxSend('GET', 'images')
      .then(function(res) {
        if (res) {
          // console.log('繪出a區banner(success):', res.bannerItem)
          
          for (let i in res.bannerItem) {
            let item = res.bannerItem[i]
            bannerHtml.push(`
                <div class="swiper-slide">
                    <a href="${item.url}" target="_blank">
                        <img class="swiper-lazy banner d-block w-100" src="../assets/images/a/${item.img}">
                    </a>
                </div>
            `)
          }

          $('#owl-demo').html(bannerHtml.join('')) //將陣列轉成字串

          // 啟動輪播功能
        swiperBannerStart()
        }
      })
      .catch(function (error) {
        console.log('繪出a區banner(error):', error)
      })


    //繪出b區1~6小廣告圖
    let adHtml = []
    ajaxSend('GET', 'images')
      .then(function(res) {
        if (res) {
          // console.log('繪出b區1~6小廣告圖(success):', res.adItem)
          for (let i in res.adItem) {
            let item = res.adItem[i]
            adHtml.push(`
                <div class="bnr-item col-md-4 col-3 ${item.key === 'display' ? 'd-none d-md-block' : ''}">
                    <a href="${item.url}" target="_blank">
                        <img src="../assets/images/b/${item.img}" alt="">
                    </a>
                </div>
            `)
          }
          $('.firstAd').html(adHtml.join(''))
        }
      })
      .catch(function (error) {
        console.log('繪出b區1~6小廣告圖(error):', error)
      })

    //繪出b區7~12小廣告圖
    let adSubHtml = []
    ajaxSend('GET', 'images')
      .then(function(res) {
        if (res) {
          // console.log('繪出b區7~12小廣告圖(success):', res.adSubItem)
          for (let i in res.adSubItem) {
            let item = res.adSubItem[i]
            adSubHtml.push(`
                <div class="bnr-item col-md-4 col-3 ${item.key === 'display' ? 'd-block d-md-none' : '' }">
                    <a href="${item.url}" target="_blank">
                        <img src="../assets/images/b/${item.img}" alt=""></a>
                </div>
            `)
          }
          $('.subAd').html(adSubHtml.join(''))
        }
      })
      .catch(function (error) {
        console.log('繪出b區7~12小廣告圖(error):', error)
      })
}

//各類內容
function content(data, fileName) {
  let tabHtml = []
  let maintenanceHtml = []
  let count = 1
  let systemHtml = []
  let all = false

  ajaxSend('GET', fileName)
    .then(function(res) {
      if (res) {
        // console.log('各類內容(success):', res)

        for (let i in res[data]) {
            let item = res[data][i]
            let title = item.name.replace("NUM_", "") //因數字會先執行，所以須作取代
            all = (title === "全部") ? true : all;
            let act = (all == true || count == 1) ? 'active show' : ''; //是全部或是點擊第一個時，判斷列表清單是否顯示(為了讓點擊第一個顯示出來)
            let arr = item.content
            //繪出各系統tab
            tabHtml.push(`
              <li class="nav-item tabList ${(location.hash === '#2' || location.hash === '#3' || location.hash === '#4') ? 'tab-col-4' : '' } 
              " ${title === '全部'? 'onclick="showAll(true,null)"' : 'onclick="showAll(false,this)"' } >
                  <a class="nav-link ${count === 1 ? 'active' : ''}" id="tab_${count}-tab" data-toggle="tab" href="#tab${count}" role="tab" aria-controls="tab${count}" aria-selected="false""">${title}</a>
              </li>
            `)

            // 小標題和內容組合 system-list group
            let dataList = []

            // 系統內容
            for (let i in arr) {
              // 小標題和內容組合
              let dataItems = []

              let items = arr[i].list
              // 小標題 push 至 dataItems
              if (arr[i].name) dataItems.push(`<div class="system-title">${arr[i].name}</div>`)

              for (let j in items) {
                  let obj2 = items[j]
                  // console.log("obj2", items[j])

                  // 內容 push 至 dataItems
                  dataItems.push(`
                    ${ page == 'maintenance'?
                        `<div class="system-item">
                            <a href="${obj2.url}" target="_blank">
                                <div class="item-title">${obj2.name}</div>
                                <div class="system-member-btn">
                                    <span class="iconfont iconarticle"></span>
                                </div>
                            </a>
                        </div>`
                        : ''
                    }
                    ${ page == 'skin' || page == 'sunscreen' ?
                        `<div class="system-item">
                                <div class="item-title">${obj2.name}
                                </div>
                                <div class="system-member-btn">
                                    <a href="${obj2.url}" target="_blank">
                                        <span class="iconfont iconarticle"></span>
                                    </a>
                                </div>
                                <div class="system-manage-btn">
                                    <a href="${obj2.urlManage}" target="_blank">
                                        <span class="iconfont iconbuy"></span>
                                    </a>
                                </div>
                            </div>`
                        : ''
                    }
                    ${page !== 'maintenance' && page !== 'skin' && page !== 'sunscreen'?
                    `<div class="system-item">
                        <div class="item-title">
                            <a href="${obj2.url}" target="_blank">
                                ${obj2.name}
                            </a>
                        </div>
                    </div>`
                        : ''
                    }
                  `)
              }

              dataList.push(`
                  <div class="system-list">
                      ${dataItems.join('')}
                  </div>
              `)
            }

            maintenanceHtml.push(dataList.join(''))

            systemHtml.push(`
                <div class="tab-pane fade ${act}" id="tab${count}" role="tabpanel" aria-labelledby="tab${count}-tab">
                      ${maintenanceHtml.join('')}
                </div>
            `)
            maintenanceHtml = [] //清空避免疊加
            count++

        }

        // console.log('tabHtml:', tabHtml)
        // console.log('systemHtml:', systemHtml)

        $('#myTab').html(tabHtml.join(''))
        $("#myTabContent").html(systemHtml.join(''))
      }
    })
    .catch(function (error) {
      console.log('各類內容(error):', error)
    })
}

//顯示全部的內容: 假如title等於"全部"，是true就加class active show
function showAll(bol,obj) {
  if (bol == true)
    $('div.tab-pane.fade').addClass('active show')
  else
    $('div.tab-pane.fade').removeClass('active show')
    //解決按第二次時內容會消失，因當點擊第二次時會把active show移除
    //幫bootstrap再做一次點擊，以便秀active show
    let tabHref = $(obj).find('a').attr('href')   //找到點選的tab連結
    $('div.tab-pane.fade'+ tabHref).addClass('active show')
}

//點擊各大分類顯示底線(基礎保養/進階護膚...)
$('.nav-item').click(function () {
  $('.nav-item').removeClass("selecteBar")
  $(this).addClass('selecteBar')
})

//判斷為進階護膚域名時，點擊基礎保養，否則點擊基礎保養
if(skin_tag === true){
  $('.nav-item').eq(1).trigger('click');
}else{
  $('.nav-item').first().trigger('click');
}

//判斷各(location.hash)，對應點擊各tab
switch (location.hash) {
  case '#2':
    $('.nav-item').eq(2).trigger('click');
    break;
  case '#3':
    $('.nav-item').eq(3).trigger('click');
    break;
  case '#4':
    $('.nav-item').eq(4).trigger('click');
    break;
  case '#5':
    $('.nav-item').eq(5).trigger('click');
    break;

  default:
    break;
}

//熱門推薦
function popular(data, fileName) {
  let popularHtml = []
  //點擊除了基礎保養跟進階護膚時，data = undefined ，所以會 = false，!data 才會 = true
  if (!data) {
      $('.popular-wrap').hide();
      return
  } else {
      $('.popular-wrap').show();
  }

  ajaxSend('GET', fileName)
    .then(function(res) {
      if (res) {
        // console.log('熱門推薦(success):', res)

        //判斷是基礎保養或進階護膚，其他清空
        for (let i in res[data]) {
            let item = res[data][i]
            popularHtml.push(`
              ${pagePopular === 'maintenancePopular' ?
              `<div class="popular-item">
                      <a href="${item.url}" target="_blank">
                          <div class="item-title">${item.name}</div>
                          <div class="popular-member-btn">
                              <span class="iconfont iconcollect"></span>
                          </div>
                      </a>
                  </div>
              `
              : ''
              }
              ${pagePopular === 'skinPopular' ?
              `<div class="popular-item">
                  <div class="item-title">${item.name}</div>
                  <div class="popular-member-btn">
                      <a href="${item.url}" target="_blank">
                          <span class="iconfont iconcollect"></span>
                      </a>
                  </div>
                  <div class="popular-manage-btn">
                      <a href="${item.urlManage}" target="_blank">
                          <span class="iconfont  iconbuy"></span>
                      </a>
                  </div>
              </div>
              `
              : ''
              }
            `)
        }

        // console.log('popularHtml:', popularHtml)

        $('.popular-list').html(popularHtml.join(''))
      }
    })
    .catch(function (error) {
      console.log('熱門推薦(error):', error)
    })
}

// 判斷熱門推薦是基礎保養還是進階護膚還或其他
function initPopular(item) {
  pagePopular = item
  switch (item) {
    case 'skinPopular':
      popular('skin_popular', 'skin')
      break;
    case 'maintenancePopular':
      popular('maintenance_popular', 'maintenance')
      break;
    default:
      popular()
      break;
  }
}

// 判斷頁面
function initPage(item) {
  page = item
  switch (item) {
    case 'skin':
      content('skin_data', 'skin')
      break;
    case 'maintenance':
      content('maintenance_data', 'maintenance')
      break;
    case 'sunscreen':
      content('sunscreen_data', 'sunscreen')
      break;
    case 'basicMakeup':
      content('basicMakeup_data', 'basicMakeup')
      break;
    case 'mackeup':
      content('mackeup_data', 'mackeup')
      break;
  }
}

// 啟動輪播
function swiperBannerStart () {
  new Swiper('#banner', {
    preventClicks: false,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    lazy: {
      loadPrevNext: true,
    },
    allowTouchMove: false,
  });
  //tab swiper
  new Swiper('.nav-wrap', {
    slidesPerView: 5,
    preventClicks: false,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      1024: {
        slidesPerView: 4,
        slidesPerGroup: 4,
        loopFillGroupWithBlank: true
      },
      414: {
        slidesPerView: 3,
        slidesPerGroup: 3,
        loopFillGroupWithBlank: true
      }
    }
  });
}

// 載入廣告圖
init()
serch_init()
// 啟動輪播
swiperBannerStart()
//搜尋
$('.search').on('select2:select', async function (e) {
  let url = await select($(".search").find("option:selected").text())
  // console.log("url:",url)
  // console.log('text:',$(".search").find("option:selected").text())
  window.open(url, '_blank')
})

//搜尋 點選指定項目跳轉網址
async function select(key) {
  let getSearch = await ajaxSend('GET', 'search')
  .then(function(res) {
  let arr = []
  for (let i in res.items) {
    if(key === res.items[i].text){
      // console.log('res',res)
      arr = res.items[i]
      // console.log('arr',res.items[i].url)
    }
  }
  return arr.url
  })
  return getSearch
}

async function serch_init(){
  let data = await searchData()
  $(".search").select2({
    placeholder: '搜尋',
    language: 'zh-TW',
    // 最少字元才觸發尋找, 0 不指定
    minimumInputLength: 0,
    // 清除
    allowClear: true,
    width: '170px',
    data: data
  });
}

async function searchData(){
  // 搜尋標題系統的資料
  let textItem =['洗臉','卸妝','去角質','眼睫保養']
  let arr = []
  for( let i in textItem ){
    let child = await sort(textItem[i])
    let o = {
      text: textItem[i] ,
      children: child
    }
    arr.push(o)
  }
  return arr
}

async function sort(type) {
  // console.log('≈≈≈',fileName)
  let getSearch = ajaxSend('GET', 'search')
  .then(function(res) {
  if (res) {
  // console.log('≈≈≈',res)
  let arr = []
  var count = 0
  for (let i in res.items) {
    // console.log('items:',res.items)
    count++
    if (res.items[i].type != type) continue;
    // console.log('type:',res.items[i].type)
    // 假如items資料裡的type，不等於sort傳進來的(type)，就跳過到指定的下個type
    // ex:sort(a)，item裡第三筆type是"b"，第四筆資料的type是"a"，那他會跳過xx找到a
    // console.log(">>>",count, res.items[i].text, res.items[i].type)
    let children = {
      id: count,text: res.items[i].text
    }
    // console.log(">>>",count, res.items[i].text, res.items[i].type)
    arr.push(children)
    // console.log('children:',arr)
  }
  return arr
  }
})
return getSearch
}

//gotop
$(window).scroll(function () {
  if ($(this).scrollTop() > 100) {
    $('.toTop').fadeIn()
  } else {
    $('.toTop').fadeOut()
  }
})
$('.toTop').click(function () {
  $('html, body').animate({
    scrollTop: 0
  }, 800)
  return false
})

//手機版收合廣告
$('.pulse-button').click(function () {
  $(".ad").slideToggle("slow");
  if ($(".arrow").hasClass('ready')) {
    $(".collapse-ad").text("展開廣告");
    $(".arrow").removeClass("ready");
    $(".iconarrowdown").removeClass("chevron-on").addClass("chevron-down");
  } else {
    $(".collapse-ad").text("收合廣告");
    $(".arrow").addClass("ready");
    $(".iconarrowdown").removeClass("chevron-down").addClass("chevron-on");
  }
})