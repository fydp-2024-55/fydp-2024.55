(function () {
  const modalHTML = `
      <div id="myModal" style="display:block;position:fixed;z-index:1000;left:0;top:0;width:100%;height:100%;overflow:auto;background-color:rgb(0,0,0);background-color:rgba(0,0,0,0.4);">
        <div style="background-color:#fefefe;margin:15% auto;padding:20px;border:1px solid #888;width:80%;">
          <p>To use this extension, please enable the "Do Not Track" setting.</p>
          <ol>
            <li>Open Chrome settings by clicking the three dots in the upper right corner.</li>
            <li>Select 'Settings'.</li>
            <li>In the search bar at the top, type 'Do Not Track'.</li>
            <li>Enable the 'Do Not Track' request.</li>
          </ol>
          <p>Once you have enabled the setting, please refresh this page.</p>
          <button onclick="document.getElementById('myModal').style.display='none'">Close</button>
        </div>
      </div>
    `;

  document.body.insertAdjacentHTML("beforeend", modalHTML);
})();
