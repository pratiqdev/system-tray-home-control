

async function restartApp() {
    await Neutralino.app.restartProcess()
}




function setHtml(selector, html){
    if(!document || !document.getElementById){
        console.log('No document!!')
    }
    let el = document.getElementById(selector)
    
    if(el){
        el.innerHTML = html
    }else{
        console.log('No element!', selector)
    }
}



async function getAllInfo(){

    const INFO = {}
    
    
    
    try{
        
        INFO['NL_APPID'] = NL_APPID 
        INFO['NL_CVERSION'] = NL_CVERSION 
        INFO['NL_MODE'] = NL_MODE 
        INFO['NL_OS'] = NL_OS 
        INFO['NL_PORT'] = NL_PORT 
        INFO['NL_VERSION'] = NL_VERSION 
        
        
        const mem = await Neutralino.computer.getMemoryInfo()
        INFO['RAM_BYTES'] = mem.physical.total
        
        let arch = await Neutralino.computer.getArch();
        INFO['SYS_ARCH'] = arch

        let kernelInfo = await Neutralino.computer.getKernelInfo();
        INFO['KERNEL_VARIANT'] = kernelInfo.variant
        INFO['KERNEL_VERSION'] = kernelInfo.version

        let osInfo = await Neutralino.computer.getOSInfo();
        INFO['KERNEL_VERSION'] = osInfo.name
        
        let cpuInfo = await Neutralino.computer.getCPUInfo();
        INFO['CPU_VENDOR'] = cpuInfo.vendor
        INFO['CPU_MODEL'] = cpuInfo.model
        INFO['CPU_FREQ'] = cpuInfo.frequency
        INFO['CPU_ARCH'] = cpuInfo.architecture
        INFO['CPU_THREADS'] = cpuInfo.logicalThreads
        INFO['CPU_CORES'] = cpuInfo.physicalCores
        INFO['CPU_PUNITS'] = cpuInfo.physicalUnits


        let displays = await Neutralino.computer.getDisplays();
        INFO['DISPLAYS'] = displays

        let pos = await Neutralino.computer.getMousePosition();
        INFO['MOUSE_X'] = pos.x
        INFO['MOUSE_Y'] = pos.y
        
        setHtml('system-info', JSON.stringify(INFO, null, 2))
    }catch(err){
        setHtml('system-info', `There was an error getting system info: ${JSON.stringify(err)}`)   
    }



}









function createTrayMenu() {
    if(NL_MODE != "window") {
        console.log("INFO: Tray menu is only available in the window mode.");
        return;
    }
    let tray = {
        icon: "/resources/icons/trayIcon.png",
        menuItems: [
            {id: "VERSION", text: "Test dialogue box"},
            {id: "NOTIFY", text: "Test notifications"},
            {id: "SHOW", text: "Show application"},
            {id: "QUIT", text: "Quit the app"}
        ]
    };
    Neutralino.os.setTray(tray);
}






function onTrayMenuItemClicked(event) {
    switch(event.detail.id) {
        case "VERSION":
            Neutralino.os.showMessageBox("Version information",
            `Neutralinojs server: v${NL_VERSION} | Neutralinojs client: v${NL_CVERSION}`);
            break;
            
        case "NOTIFY":
            Neutralino.os.execCommand(`notify-send 'Ayo, can you see me?'`);
            break;

            case "NOTIFY":
                Neutralino.os.execCommand(`notify-send 'Ayo, can you see me?'`);
                break;

        case "QUIT":
            Neutralino.app.exit();
            break;
    }
}






function onWindowClose() {
    // Should remove this so app can run in the background
    Neutralino.app.exit();
}



Neutralino.init();

Neutralino.events.on("trayMenuItemClicked", onTrayMenuItemClicked);
Neutralino.events.on("windowClose", onWindowClose);

if(NL_OS != "Darwin") { // Fix https://github.com/neutralinojs/neutralinojs/issues/615
    createTrayMenu();
}


getAllInfo()