
var password = '1024';
var DEBUG = true;
var hostname = '192.168.31.147'//server

auto()

var data = {};
var isScreenOn = device.isScreenOn();

if (!DEBUG && isScreenOn) {
    console.log('Release模式且屏幕亮起,脚本停止工作');
    exit();
}

if (!isScreenOn) {
    UnlockScreen();
}

Main();

function Main() {
    EnterStepPage();
    while (scrollUp(0)) { }
    GetData();
    sleep(300);
    while (scrollDown(0)) {
        sleep(300);
        GetData();
    }
    //data = RemoveDuplicatedItem(data);

    //最终要post的数据
    var data_post = {
        'TimeStamp': Date.parse(new Date()) / 1000,
        'NameStep': data,
    };
    console.log(data_post);

    sleep(500)
    back()
    sleep(500)
    back()
    sleep(500)
    back()

    var url = 'http://' + hostname + '/api/record'
    console.log(url)
    try {
        http.postJson(url, data_post)
        console.log('submit Success')
    } catch (e) {
        console.log('submit fail')
    }

    if (!isScreenOn) {
        Power()//lock
    }
}
function EnterStepPage() {
    console.log("Begin EnterStepPage")
    launchApp("微信");
    sleep(1500);
    if (id('aol').exists()) {//联系人界面
        back()
        sleep(300);
    }
    click("微信运动");
    console.log("Enter 微信运动")
    sleep(300);
    click("步数排行榜");
    console.log("Enter 步数排行榜")
    sleep(1000);
}
function UnlockScreen() {
    for (var i = 0; i < 3; i++) {
        console.log(i)
        device.wakeUp();
        sleep(200);
        gesture(200, [540, 2000], [540, 100]);//上滑唤出密码解锁界面
        Text(password);
        console.log(password)
        sleep(100);
        OK();
        sleep(500);
        if (!text('PIN 码错误').exists()) {
            console.log('success')
            break
        } else {
            Power()
            sleep(1000)
        }
    }
}

//获得当前页的数据
function GetData() {
    //console.log("GetData")
    var array_name = new Array();
    var array_step = new Array();

    var i = 0;
    //当前页的姓名
    id("bo0").findOne().children().forEach(child => {
        var target = child.findOne(id("bob"));
        if (target != null) {
            //console.log(target);
            array_name[i] = target.text();
            i++;
        }
    });
    //console.log(i);
    i = 0;
    //当前页的步数
    id("bo0").findOne().children().forEach(child => {
        var target = child.findOne(id("bmz"));
        if (target != null) {
            //console.log(target);
            array_step[i] = target.text();
            i++;
        }
    });
    for (var j = 0; j < i; j++) {
        //console.log("j=" + j)
        var name = array_name[j];
        //console.log(typeof array_step[j])
        var step = array_step[j];
        data[name] = step;
        //console.log('length=' + data.length)
    }
    //console.log("GetData end")

    //console.log(i);
    //data = array.concat(array, data);
}
//排序后去除重复项
function RemoveDuplicatedItem(ar) {
    var ret = [],
        end;
    ar.sort();
    end = ar[0];
    ret.push(ar[0]);

    for (var i = 1; i < ar.length; i++) {
        if (ar[i] != end) {
            ret.push(ar[i]);
            end = ar[i];
        }
    }

    return ret;
}