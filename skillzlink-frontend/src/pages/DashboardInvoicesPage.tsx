import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardInvoicesPage() {
  const invoices = [
    { id: 'w6FUUKqSJ3gePjsD', date: 'February 3, 2019', amount: '$19.00' },
    { id: 'CrtDNFnJVm7w8kFA', date: 'February 15, 2019', amount: '$24.00' },
    { id: '4JppL9xYXRsSvUy9', date: 'February 16, 2019', amount: '$19.00' },
    { id: 'ArnP5mD2PdKcxYJJ', date: 'February 27, 2019', amount: '$24.00' },
    { id: '5UP9JaLDpAxn6b6Z', date: 'February 17, 2019', amount: '$24.00' },
    { id: 'Npc2SHPfBW2ejwKy', date: 'February 28, 2019', amount: '$24.00' },
    { id: 'edaTuQwUE3yYd7TC', date: 'February 27, 2019', amount: '$19.00' },
    { id: 'S6R4DR7gbWp3SH4W', date: 'February 28, 2019', amount: '$19.00' }
  ];

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-9 float-right">
            <div className="wt-dashboardbox wt-dashboardinvocies">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Invoices</h2>
                <form className="wt-formtheme wt-formsearch">
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="Search" className="form-control" placeholder="Search Here" />
                      <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="wt-dashboardboxcontent wt-categoriescontentholder wt-categoriesholder">
                <table className="wt-tablecategories">
                  <thead>
                    <tr>
                      <th>
                        <span className="wt-checkbox">
                          <input id="wt-name" type="checkbox" name="head" />
                          <label htmlFor="wt-name"></label>
                        </span>
                      </th>
                      <th>Invoice ID</th>
                      <th>Purchase Date</th>
                      <th>Expiry Date</th>
                      <th>Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((invoice, index) => (
                      <tr key={index}>
                        <td>
                          <span className="wt-checkbox">
                            <input id={`wt-name${index}`} type="checkbox" name="head" />
                            <label htmlFor={`wt-name${index}`}></label>
                          </span>
                        </td>
                        <td>{invoice.id}</td>
                        <td>{invoice.date}</td>
                        <td>{invoice.date}</td>
                        <td>{invoice.amount}</td>
                        <td>
                          <div className="wt-actionbtn">
                            <a href="#!" className="wt-addinfo wt-skillsaddinfo">view</a>
                            <a href="#!" className="wt-deleteinfo">Print</a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <nav className="wt-pagination">
                  <ul>
                    <li className="wt-prevpage"><a href="#!"><i className="lnr lnr-chevron-left"></i></a></li>
                    <li><a href="#!">1</a></li>
                    <li><a href="#!">2</a></li>
                    <li><a href="#!">3</a></li>
                    <li><a href="#!">4</a></li>
                    <li><a href="#!">...</a></li>
                    <li><a href="#!">50</a></li>
                    <li className="wt-nextpage"><a href="#!"><i className="lnr lnr-chevron-right"></i></a></li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-6 col-xl-3 float-left">
            <div className="wt-dashboardboxcontent wt-offersidebar wt-dashboardbox-margin">
              <figure><img src="/images/save-img-01.jpg" alt="img description" /></figure>
              <div className="wt-offercontent">
                <h2>Save Big, Do Big</h2>
                <p>Consectetur adipisicing elitems sed dotem eiusmod tempor incune utnaem labore etdolore maigna aliqua enim.</p>
                <a href="#!" className="wt-btn">Renew Now</a>
              </div>
            </div>
            <div className="wt-companyad">
              <figure className="wt-companyadimg"><img src="/images/add-img.jpg" alt="img description" /></figure>
              <span>Advertisement  255px X 255px</span>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}
