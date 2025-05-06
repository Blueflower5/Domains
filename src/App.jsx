import ObjectList from "./objectList";

function App() {
  return (
    <>
      <div>Domains</div>
      <div>
        <button>+ Add Domain</button>
        <span>sort</span>
        <span>search</span>
      </div>
      <ul id="domainList">Rows will be added dynamically here</ul>
      <ObjectList />
      {/*       
<script>
  // Replace with the actual API URL
  fetch("https://example.com/api/domains")
    .then(response => response.json())
    .then(data => {
      const domainList = document.getElementById("domainList");

      domainList.innerHTML = data.map(domain => 
        `<li>
          ${domain.name}
          <button onclick="checkStatus('${domain.name}')">Check Status</button>
          <button onclick="deleteDomain('${domain.name}')">Delete</button>
        </li>`
      ).join(""); // `.join("")` removes default array commas
    })
    .catch(error => console.error("Error fetching domains:", error));

  // Function to check domain status
  function checkStatus(domain) {
    alert(`Checking status for: ${domain}`);
    // You can replace this with an API call to get the actual status
  }

  // Function to delete domain
  function deleteDomain(domain) {
    alert(`Deleting domain: ${domain}`);
    // You can replace this with an API call to delete the domain
  }
</script> */}
      <div>Add Domain</div>
      <input type="text"></input>
      <div>
        <button>cancel</button>
        <button>Add</button>
      </div>
    </>
  );
}

export default App;
