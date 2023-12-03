import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Logo from './styles/NSP1.png';
// import Logo from './styles/NSP.jpeg';
import DLogo from './styles/dailer.png';
import CMLogo from './styles/cust.jpg';
import LLogo from './styles/leadm.jpg';
import TLogo from './styles/team.jpg';
import RLogo from './styles/rep.jpg';
import SLogo from './styles/scale.jpg';
import LLLogo from './styles/leadleak.jpg';
import CALogo from './styles/capital.jpeg';
import CRMImage from './styles/npcrm.png'; 
import './styles/Home.css';

export default function Home() {

    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isProductTooltipVisible, setProductTooltipVisible] = useState(false);
    const [isCompanyTooltipVisible, setCompanyTooltipVisible] = useState(false);

    const toggleProductTooltip = () => {
        setProductTooltipVisible(!isProductTooltipVisible);
    };

    const toggleCompanyTooltip = () => {
        setCompanyTooltipVisible(!isCompanyTooltipVisible);
    };


    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };


   

    const faqData = [
        
        {
            question: 'Can I customize the features of NSP CRM?',
            answer: 'Yes, NSP CRM offers a range of customizable features...',
        },

        {
            question:'What is Telecalling CRM?' ,
            answer: 'Telecalling CRM is a specialized customer relationship management software tailored for telecalling and telesales activities. It empowers businesses to efficiently manage their calling campaigns, track leads, and enhance communication with clients.' ,
        },

        {
            question:'How is it different from normal CRM?' ,
            answer: 'While a normal CRM focuses on general customer relationship management, a Telecalling CRM like NSP CRM is designed specifically for telecalling and telesales. It offers features like call tracking, lead management, and campaign management to optimize telesales efforts.' ,
        },
        {
            question:'How to manage your telesales activities through NSP CRM?' ,
            answer: 'NSP CRM provides a user-friendly interface to manage telesales activities. You can easily make calls, log call details, assign leads to your team, and track progress using the built-in dashboard. It streamlines your telecalling process for better efficiency.'  ,
        },
        {
            question:'Can I use NSP CRM for lead segmentation?' ,
            answer:'Absolutely! NSP CRM provides advanced lead segmentation tools. You can categorize leads based on various criteria such as demographics, behavior, and interests. This helps you target your marketing and sales efforts more precisely.'  ,
        },
        {
            question:'Why does my business need a telecalling CRM?' ,
            answer:'A telecalling CRM like NSP CRM can significantly boost your sales efforts. It helps streamline your calling campaigns, improve lead tracking, and enhance customer interactions. By using a dedicated telecalling CRM, you can save time, increase efficiency, and ultimately drive growth.'  ,
        },
        // Add more FAQ items here
    ];

    const [activeQuestion, setActiveQuestion] = useState(null);

    const handleQuestionClick = (index) => {
        if (activeQuestion === index) {
            setActiveQuestion(null);
        } else {
            setActiveQuestion(index);
        }
    };
    



    return (
        <div className='home-page'>
            <header className='home-header'>
                <div className='home-logo'>
                    <img src={Logo} alt='Logo' />
                </div>
                <nav className='home-nav'>
                <div className='home-nav-container'>
                    <ul className='home-menu'>
                    <li
                                className={`home-menu-item home-dropdown ${isProductTooltipVisible ? 'tooltip-visible' : ''}`}
                                onMouseEnter={toggleProductTooltip}
                                onMouseLeave={toggleProductTooltip}
                            >
                                  <span className='home-dropdown-label'>Products</span>
                                <div className={`home-dropdown-content ${isProductTooltipVisible ? 'tooltip-visible' : ''}`}>
                                    <ul className='home-dropdown-list'>
                                        <li><Link to='/dialer'>Dialer</Link></li>
                                        <li><Link to='/lead-management'>Lead Management</Link></li>
                                        <li><Link to='/team-management'>Team Management</Link></li>
                                        <li><Link to='/customer-management'>Customer Management</Link></li>
                                        <li><Link to='/reporting'>Reporting</Link></li>
                                    </ul>
                                </div>
                                
                            </li>
                            <li className={`home-menu-item home-dropdown ${isCompanyTooltipVisible ? 'tooltip-visible' : ''}`}
                                onMouseEnter={toggleCompanyTooltip}
                                onMouseLeave={toggleCompanyTooltip}
                            >
                                <span className='home-dropdown-label' onClick={toggleDropdown}>Company</span>
                                <div className={`home-dropdown-content ${isProductTooltipVisible ? 'tooltip-visible' : ''}`}>
                                    <ul className='home-dropdown-list'>
                                        <li><Link to='/dialer'>About Us</Link></li>
                                        <li><Link to='/lead-management'>Contact Us</Link></li>
                                        
                                        
                                    </ul>
                                </div>

                                
                                
                            </li>

                            <span className=''>Pricing</span>

                            
                        <li><Link className='home-buttonClass' to=''>Demo</Link></li>
                        <li><Link to='/login' className='home-buttonClass'>Login</Link></li>
                    </ul>
                    </div>
                </nav>
            </header>



            <div className='home-page-content'>
                {/* Your page content */}

                <div className='home-centered-container'>
                    <div className='home-welcome-box'>
                        <h1>Welcome to NSP CRM</h1>
                        <p className='home-welcome-text'>
                            Empower your business with our comprehensive CRM solution.
                            Efficiently manage leads, teams, and customer relationships.
                            Elevate your workflow and drive growth with NSP CRM.
                        </p>
                    </div>
                    <div className='home-crm-image'>
                    <img src={CRMImage} alt='CRM Image' />
                    </div>
                </div>


                
                <div className='home-feature-container'>
                <div className='home-feature'>
                    <img src={DLogo} alt='Dialer' />
                    <h3>Dialer</h3>
                    <p>Effortlessly manage your calls and enhance communication with clients.</p>
                </div>
                
                <div className='home-feature'>
                    <img src={TLogo} alt='Team Management' />
                    <h3>Team Management</h3>
                    <p>Empower your team with powerful collaboration and productivity tools.</p>
                </div>
                <div className='home-feature'>
                    <img src={CMLogo} alt='Customer Engagement' />
                    <h3>Customer Engagement</h3>
                    <p>Build strong relationships and provide exceptional customer experiences.</p>
                </div>
                <div className='home-feature'>
                    <img src={LLogo} alt='Lead Management' />
                    <h3>Lead Management</h3>
                    <p>Efficiently track, nurture, and convert leads into valuable customers.</p>
                </div>
                <div className='home-feature'>
                    <img src={RLogo} alt='Reporting' />
                    <h3>Reporting</h3>
                    <p>Gain valuable insights through comprehensive and intuitive reporting.</p>
                </div>
            </div>

            <div className='home-demo-button-container'>
            <Link to='/demo' className='home-demo-button'>Try Demo</Link>
            </div>


            {/* Perks Container */}
            <div className='home-perks-container'>
                    <h2 className='home-perks-heading'>PERKS</h2>
                    <div className='home-perks-list'>
                        <div className='home-perk'>
                            <img src={LLLogo} alt='No Lead Leakage' />
                            <h3>No Lead Leakage</h3>
                            <p>Ensure all your leads are properly managed and never lost.</p>
                        </div>
                        <div className='home-perk'>
                            <img src={SLogo} alt='Scalability' 
                            style={{
                                borderRadius:'50%',}}
                                 />
                            <h3>Scalability</h3>
                            <p>Grow your business with a CRM that can scale alongside your needs.</p>
                        </div>
                        <div className='home-perk'>
                            <img src={CALogo} alt='No Capital Investment' />
                            <h3>No Capital Investment</h3>
                            <p>Get started without heavy upfront costs. Pay as you go.</p>
                        </div>
                    </div>
                </div>



        <div className='home-pricing-container'>
            <h2 className='home-pricing-label'>PRICING</h2>
            <div className='home-pricing-cards'>
                <div className='home-pricing-card'>
                    <h3>Basic Plan</h3>
                    <p>Perfect for small businesses</p>
                    <div className='home-pricing-price'>INR 29/month</div>
                    <ul className='home-pricing-features'>
                        <li>Up to 1000 contacts</li>
                        <li>Basic support</li>
                        <li>Limited features</li>
                    </ul>
                    <button className='home-pricing-button'>Get Started</button>
                </div>
                <div className='home-pricing-card'>
                    <h3>Standard Plan</h3>
                    <p>For growing teams</p>
                    <div className='home-pricing-price'>INR 59/month</div>
                    <ul className='home-pricing-features'>
                        <li>Up to 5000 contacts</li>
                        <li>Priority support</li>
                        <li>Advanced features</li>
                    </ul>
                    <button className='home-pricing-button'>Get Started</button>
                </div>
                <div className='home-pricing-card'>
                    <h3>Premium Plan</h3>
                    <p>Enterprise-level solution</p>
                    <div className='home-pricing-price'>INR 99/month</div>
                    <ul className='home-pricing-features'>
                        <li>Unlimited contacts</li>
                        <li>24/7 support</li>
                        <li>Full suite of features</li>
                    </ul>
                    <button className='home-pricing-button'>Get Started</button>
                </div>
            </div>
        </div>





        <div className='home-faqs-container'>
    <h2>Frequently Asked Questions</h2>
    <div className='home-faq-columns'>
        <div className='home-faq-column'>
            {faqData.slice(0, Math.ceil(faqData.length / 2)).map((faq, index) => (
                <div className='home-faq-item' key={index}>
                    <div
                        className={`faq-question ${activeQuestion === index ? 'active' : ''}`}
                        onClick={() => handleQuestionClick(index)}
                    >
                        {faq.question}
                    </div>
                    {activeQuestion === index && <div className='faq-answer'>{faq.answer}</div>}
                </div>
            ))}
        </div>
        <div className='home-faq-column'>
            {faqData.slice(Math.ceil(faqData.length / 2)).map((faq, index) => (
                <div className='home-faq-item' key={index}>
                    <div
                        className={`faq-question ${activeQuestion === index ? 'active' : ''}`}
                        onClick={() => handleQuestionClick(index + Math.ceil(faqData.length / 2))}
                    >
                        {faq.question}
                    </div>
                    {activeQuestion === index + Math.ceil(faqData.length / 2) && <div className='faq-answer'>{faq.answer}</div>}
                </div>
            ))}
            </div>
        </div>
    </div>





    <footer className='home-footer'>
            <div className='home-footer-top'>
            <div className='home-footer-logo'>
                    <img src={Logo} alt='NSP CRM' className='home-pentagon-logo' />
                </div>
                <div className='home-footer-social'>
                <div className='home-footer-title'>Connect with Us</div>
                    <div className='home-social-icons'>
                        <a href='#'><FaFacebook /></a>
                        <a href='#'><FaTwitter /></a>
                        <a href='#'><FaLinkedin /></a>
                        <a href='#'><FaInstagram /></a>
                    </div>
                </div>
                <div className='home-footer-company'>
                <div className='home-footer-title'>Company</div>
                    <ul>
                        <li><Link to='/about-us'>About Us</Link></li>
                        <li><Link to='/contact'>Contact Us</Link></li>
                    </ul>
                </div>
                <div className='home-footer-features'>
                <div className='home-footer-title'>Features</div>
                    <ul>
                        <li><Link to='/dialer'>Dialer</Link></li>
                        <li><Link to='/team-management'>Team Management</Link></li>
                        <li><Link to='/customer-engagement'>Customer Engagement</Link></li>
                        {/* Add more features */}
                    </ul>
                </div>
            </div>
            <div className='home-footer-bottom'>
                <p>&copy; {new Date().getFullYear()} NSP CRM. All rights reserved.</p>
            </div>
        </footer>






            </div>
        </div>
    );
}
