import { DashboardLayout } from '../components/layout/DashboardLayout';

export function DashboardCategoryPage() {
  const categories = [
    { icon: 'img-09.png', name: 'Advertising Director', slug: 'Advertising Director' },
    { icon: 'img-10.png', name: 'Advertising Executive', slug: 'Advertising Executive', className: 'wt-subcategories wt-child-2' },
    { icon: 'img-09.png', name: 'Advertising Manager', slug: 'Advertising Manager', className: 'wt-subcategories wt-child-3' },
    { icon: 'img-09.png', name: 'Classified Advertising Manager', slug: 'Classified Advertising Manager', className: 'wt-subcategories wt-child-4' },
    { icon: 'img-10.png', name: 'Promotion Manager', slug: 'Promotion Manager' },
    { icon: 'img-10.png', name: 'Promotions Director', slug: 'Promotions Director' },
    { icon: 'img-09.png', name: 'VP Advertising', slug: 'VP Advertising' }
  ];

  return (
    <DashboardLayout>
      <section className="wt-haslayout wt-dbsectionspace">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-4 float-left">
            <div className="wt-dashboardbox">
              <div className="wt-dashboardboxtitle">
                <h2>Add New Category</h2>
              </div>
              <div className="wt-dashboardboxcontent">
                <form className="wt-formtheme wt-formprojectinfo wt-formcategory">
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="Name" className="form-control" placeholder="Name" />
                      <span className="form-group-description">Dolore magna aliqua enim adminim</span>
                    </div>
                    <div className="form-group">
                      <span className="wt-select">
                        <select defaultValue="">
                          <option value="" disabled>Select parent Category</option>
                          <option value="1">Category 1</option>
                          <option value="2">Category 2</option>
                        </select>
                      </span>
                      <span className="form-group-description">Elit sed do eiusmod tempor incididunt ut labore</span>
                    </div>
                    <div className="form-group">
                      <textarea name="message" className="form-control" placeholder="Description"></textarea>
                      <span className="form-group-description">Veniam quis nostrud exercitation</span>
                    </div>
                    <div className="form-group form-group-label">
                      <div className="wt-labelgroup">
                        <label htmlFor="file">
                          <span className="wt-btn">Select Files</span>
                          <input type="file" name="file" id="file" />
                        </label>
                        <span>Drop files here to upload</span>
                        <em className="wt-fileuploading">Uploading<i className="fa fa-spinner fa-spin"></i></em>
                      </div>
                    </div>
                    <div className="form-group">
                      <ul className="wt-attachfile">
                        <li className="wt-uploading">
                          <span className="uploadprogressbar"></span>
                          <span>Category Icon.jpg</span>
                          <em>File size: 300 kb<a href="#!" className="lnr lnr-cross"></a></em>
                        </li>
                      </ul>
                    </div>
                    <div className="form-group wt-btnarea">
                      <a href="#!" className="wt-btn">Add New Category</a>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-8 float-right">
            <div className="wt-dashboardbox wt-categorys">
              <div className="wt-dashboardboxtitle wt-titlewithsearch">
                <h2>Category</h2>
                <form className="wt-formtheme wt-formsearch">
                  <fieldset>
                    <div className="form-group">
                      <input type="text" name="category" className="form-control" placeholder="Search Category" />
                      <a href="#!" className="wt-searchgbtn"><i className="lnr lnr-magnifier"></i></a>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="wt-dashboardboxcontent wt-categoriescontentholder">
                <table className="wt-tablecategories">
                  <thead>
                    <tr>
                      <th>
                        <span className="wt-checkbox">
                          <input id="wt-name" type="checkbox" name="head" />
                          <label htmlFor="wt-name"></label>
                        </span>
                      </th>
                      <th>Icon</th>
                      <th>Name</th>
                      <th>Slug</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={index}>
                        <td>
                          <span className="wt-checkbox">
                            <input id={`wt-name${index}`} type="checkbox" name="categories" />
                            <label htmlFor={`wt-name${index}`}></label>
                          </span>
                        </td>
                        <td><figure><img src={`/images/categories/${category.icon}`} alt="img description" /></figure></td>
                        <td className={category.className || ''}>{category.name}</td>
                        <td>{category.slug}</td>
                        <td>
                          <div className="wt-actionbtn">
                            <a href="#!" className="wt-addinfo wt-skillsaddinfo"><i className="lnr lnr-pencil"></i></a>
                            <a href="#!" className="wt-deleteinfo"><i className="lnr lnr-trash"></i></a>
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
        </div>
      </section>
    </DashboardLayout>
  );
}
