const enumerateDevices = async (into: Element) => {
  const devices = await navigator.mediaDevices.enumerateDevices();

  const elements = devices.map(d => {
    const el = document.createElement("li");
    el.innerText = `[${d.kind}] ${d.label}`;

    return el;
  })
  into.replaceChildren(...elements);
}

window.addEventListener("DOMContentLoaded", async () => {
  document.querySelector<HTMLElement>("#location")!.innerText = location.href;

  //This requests permission and ensures we can actually enumerate devices.
  document.querySelector<HTMLVideoElement>("#stream")!.srcObject =
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

  const deviceList = document.querySelector("#devices")!;
  await enumerateDevices(deviceList);

  //Register a listener for the devicechange event.
  //
  //This *never* fires on MacOS when running within the tauri:// protocol (i.e. release mode).
  //It does work from http://localhost:1420 and on Windows in release mode without issues.
  navigator.mediaDevices.addEventListener("devicechange", async () => {
    await enumerateDevices(deviceList);
  });
});
