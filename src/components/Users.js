import React, { useState } from "react";
import axios from "axios";
import "../App.css";

function Users() {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataFetched, setDataFetched] = useState(false);
  const [startUserId, setStartUserId] = useState(1);
  const [endUserId, setEndUserId] = useState(10);

  const itemsPerPage = 5;

  const handleFetchData = async () => {
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );

      setDataFetched(true);
      setFilterText("");
      setSortBy(null);
      setSortOrder("asc");
      setCurrentPage(1);
      setStartUserId(1);
      setEndUserId(10);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (e) => {
    const { value } = e.target;
    setFilterText(value);
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (users.length === 0) {
      return;
    }

    if (sortBy === column) {
      const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newSortOrder);
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy) {
      const valueA = a[sortBy];
      const valueB = b[sortBy];

      if (sortOrder === "asc") {
        return String(valueA).localeCompare(String(valueB));
      } else {
        return String(valueB).localeCompare(String(valueA));
      }
    }
    return 0;
  });

  const filteredUsers = sortedUsers.filter((user) => {
    if (user && user.name) {
      return user.name.toLowerCase().includes(filterText.toLowerCase());
    }
    return false;
  });

  const filteredUsersInRange = filteredUsers.filter((user) => {
    const userId = parseInt(user.id, 10);
    return userId >= startUserId && userId <= endUserId;
  });

  const totalPages = Math.ceil(filteredUsersInRange.length / itemsPerPage);

  const displayedUsers = filteredUsersInRange.slice(start, end);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h1>Fetch Data using Axios</h1>
      <button onClick={handleFetchData}>Fetch Data</button>

      {dataFetched && (
        <div>
          <div className="table-controls">
            <div className="bar">
              <input
                type="text"
                placeholder="Search by name"
                value={filterText}
                onChange={handleFilter}
              />
            </div>
            <div className="input-container">
              <label>Start User ID:</label>
              <input
                type="number"
                value={startUserId}
                onChange={(e) => setStartUserId(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>End User ID:</label>
              <input
                type="number"
                value={endUserId}
                onChange={(e) => setEndUserId(e.target.value)}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th
                  onClick={() => handleSort("name")}
                  className={sortBy === "name" ? sortOrder : ""}
                >
                  NAME
                </th>
                <th
                  onClick={() => handleSort("email")}
                  className={sortBy === "email" ? sortOrder : ""}
                >
                  EMAIL
                </th>
                <th
                  onClick={() => handleSort("website")}
                  className={sortBy === "website" ? sortOrder : ""}
                >
                  WEBSITE
                </th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.website}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              &#9664;
            </button>
            <span>
              {currentPage}&nbsp;of&nbsp;{totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              &#9654;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;
