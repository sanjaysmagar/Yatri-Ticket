'use client'
import React from 'react';
import TicketList from '../components/client/ticketList'
import { FlightProvider } from '../components/client/FightContext';
import './page.css'


const TicketDetails = () => {
    return(
     <div>
    <TicketList />
    </div>
    )
};

export default TicketDetails;
