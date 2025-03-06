import './dashboard.css';
import ListCard from '../ListCard/ListCard';
import Reports from '../Reports/Reports';
import RecentSales from '../RecentSales/RecentSales';
import TopSelling from '../TopSelling/TopSelling';
import RecentActivity from '../RecentActivity/RecentActivity';
import BudgetReport from '../BudgetReport/BudgetReport';
import WebTraffic from '../WebTraffic/WebTraffic';
import News from '../News/News';


// npx json-server --watch --port 4000 ./api/fakeapi.json

const Dashboard = () => {

    return(
       <section className="dashboard section">
        <div className="row">
            <div className="col-lg-8">
                <div className="row">
                        <ListCard />
                    <div className='col-12'>
                        <Reports/>
                    </div>
                    <div className='col-12'>
                        <RecentSales />
                    </div>
                    <div className='col-12'>
                        <TopSelling />
                    </div>
                </div>
            </div>
            {/* Right */}
            <div className="col-lg-4">
                <RecentActivity />
                <BudgetReport />
                <WebTraffic />
                <News />
            </div>
        </div>
       </section>
    );
}

export default Dashboard;