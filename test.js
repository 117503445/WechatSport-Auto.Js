auto();
var password = '1024'

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