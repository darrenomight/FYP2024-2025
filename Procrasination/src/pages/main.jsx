import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import Sidebar from "../components/sidebar"; 
import DashboardCards from "../components/dashboard_cards"; 
const Main = () => {
    return (
        <div className="d-flex flex-column vh-100">
            

            <div className="container-fluid flex-grow-1">
                <div className="row">
                    {/* Sidebar (User Profile Info) */}
                    <div className="col-md-3 bg-light p-4">
                        <Sidebar/>
                    </div>

                    {/* Main Content (Dashboard Cards) */}
                    <div className="col-md-9 p-4">
                        <DashboardCards/>
                    </div>
                </div>
            </div>

            
        </div>
    );
};

export default Main;
