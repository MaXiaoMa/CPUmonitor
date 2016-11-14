  var wsUri ="ws://localhost.360xr.cn:1234/socket"; 
    var container;  
    
    function init() { 
        container = document.getElementById("container"); 
        testWebSocket(); 
    }  
 
    function testWebSocket() { 
        websocket = new WebSocket(wsUri); 
        websocket.onopen = function(evt) { 
            onOpen(evt) 
        }; 
        websocket.onclose = function(evt) { 
            onClose(evt) 
        }; 
        websocket.onmessage = function(evt) { 
            onMessage(evt) 
        }; 
        websocket.onerror = function(evt) { 
            onError(evt) 
        }; 
    }  
 
    function onOpen(evt) { 
        console.log("已连接");
    }  
 
    function onClose(evt) {
        console.log("连接已断开");
    }  
 
    function onMessage(evt) {
        var data = JSON.parse(evt.data);
        writeToScreen(data);
    }  
 
    function onError(evt) {
        console.log(evt.data);
    }  

 
    function writeToScreen(message) {
        var cpu1_use = message.CpuUsage[0]+"%";
        var cpu2_use = message.CpuUsage[1]+"%";
        if(message.Temperature == undefined)message.Temperature=[0,0];
        //console.log(message.Temperature);
        var cpu1_temp = message.Temperature[0]+"%";
        var cpu2_temp = message.Temperature[1]+"%";
        var rom_use = Math.round(message.MemUsage) + "%";
        var target_ip = message.Ip;
        if(ip.indexOf(target_ip)==-1)return;
        update(target_ip,"cpu1use",cpu1_use);
        update(target_ip,"cpu2use",cpu2_use);
        update(target_ip,"cpu1temp",cpu1_temp);
        update(target_ip,"cpu2temp",cpu2_temp);
        update(target_ip,"romuse",rom_use);
    }
var ip = [];
  for(var i = 101;i<=162;i++){
      var baseStr = "192.168.10.";
      var ipStr = baseStr + i;
      ip.push(ipStr);
  }
  ip.push("192.168.10.251");
  ip.push("192.168.10.252");
  function render(){
      var data = {
          ip:ip
      };
      var html = template("container",data);//渲染模板
      document.getElementById('content').innerHTML = html;//填充数据
  }

  function update(elementId,itemClassName,value){
      var content = document.getElementById(elementId);//根据IP获取对应的元素
      var item = content.getElementsByClassName(itemClassName)[0];//获取相应的cpu项目
      var children = item.children[0];//获取进度条元素
      children.style.width = value;//设置进度条宽度
      if(itemClassName == "cpu1temp" ||itemClassName == "cpu2temp") {
          var temperature = parseFloat(value.split("%")[0]);
          if(temperature>50&&temperature<80){//温度大于50小于70时，显示黄色
              children.className = "progress-bar progress-bar-warning"
          }else if (temperature>80){//温度大于80时，显示红色
              children.className = "progress-bar progress-bar-danger"
          }else{
              children.className = "progress-bar progress-bar-success"
          }
          value = temperature +"°C"
      }
      children.lastChild.nodeValue = value;//设置进度条显示数值
  }
    window.addEventListener("load",render,false);
    window.addEventListener("load", init, false);