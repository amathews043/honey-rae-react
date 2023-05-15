import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { isStaff } from "../../utils/isStaff"
import { TicketCard } from "./TicketCard"
import { getAllTickets, searchTicketsByStatus, searchTicketsByDes } from "../../managers/TicketManager"
import "./Tickets.css"

export const TicketList = () => {
  const [active, setActive] = useState("")
  const [tickets, setTickets] = useState([])
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getAllTickets().then((res) => setTickets(res))
  }, [])

  useEffect(() => {
    const activeTicketCount = tickets.filter(t => t.date_completed === null).length
    if (isStaff()) {
      setActive(`There are ${activeTicketCount} open tickets`)
    }
    else {
      setActive(`You have ${activeTicketCount} open tickets`)
    }
  }, [tickets])

  useEffect(() => {
    if (query.length > 1) {
      searchDes(query)
    }
    else {
      getAllTickets().then((res) => setTickets(res))
    }
  }, [query])

  const toShowOrNotToShowTheButton = () => {
    if (isStaff()) {
      return <div>
        <input type="text" placeholder="Search by filtering" value={search} onChange={(e) => setSearch(e.target.value)}/> 
        <input type="text" placeholder="Search by query" value={query} onChange={(e) => setQuery(e.target.value)}/> 
        </div>
    }
    else {
      return <button className="actions__create"
        onClick={() => navigate("/tickets/create")}>Create Ticket</button>
    }
  }

  const filterTickets = (status) => {
    searchTicketsByStatus(status).then((res) => setTickets(res))
  }

// The book work wants us to search by sending a request to the server. 
  const searchDes = (des) => {
    searchTicketsByDes(des).then((res) => {setTickets(res)})
  }

  // My way of searching 
  const searchTickets = search.length === 0 ? tickets : tickets.filter((ticket) => 
    {
      return ticket.description.toLowerCase().includes(search.toLowerCase())
    })
    

  return <>
    <div>
      <button onClick={() => filterTickets("done")}>Show Done</button>
      <button onClick={() => filterTickets("all")}>Show All</button>
      <button onClick={() => filterTickets("unclaimed")}>Show Unclaimed</button>
      <button onClick={() => filterTickets("inprogress")}>Show In Progress</button>
    </div>
    <div className="actions">{toShowOrNotToShowTheButton()}</div>
    <div className="activeTickets">{active}</div>
    <article className="tickets">
      {
        searchTickets.map(ticket => (
          <TicketCard key={`ticket--${ticket.id}`} ticket={ticket} />
        ))
      }
    </article>
  </>
}
