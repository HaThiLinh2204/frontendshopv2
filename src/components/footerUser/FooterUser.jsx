import React from "react";
import './Footer.css';

function Footer() {
    return (
        <div className="footer-page">
            <div className="footer-navbar">
                {/* <div className="navbar-title">
                    FURLAR - THỜI TRANG CAO CẤP
                </div> */}
                <div className="footer-detail">
                    <div className="footer-navbar-item">
                        <div className="navbar-item-title">
                            FURLAR - THỜI TRANG CAO CẤP
                        </div>
                        <div className="item-detail">
                            <div className="detail-address">
                                Địa chỉ: 102 Thái Thịnh, Đống Đa, Hà Nội
                            </div>
                            <div className="detail-telnumber">
                                Chăm sóc khách hàng: 1900.2812
                            </div>
                            <div className="detail-email">
                                Email: furlarshop@gmail.com.vn
                            </div>
                            <div>
                                Mua hàng gọi: 1100 2468
                            </div>
                        </div>

                    </div>
                    <div className="footer-navbar-item">
                        <div className="navbar-item-title">
                            VỀ CHÚNG TÔI
                        </div>
                        <div className="item-detail">
                            <div>
                                Chính sách giao nhận, vận chuyển
                            </div>
                            <div>
                                Hướng dẫn thanh toán
                            </div>
                            <div>
                                Tra cứu đơn hàng
                            </div>
                            <div>
                                Hướng dẫn chọn size
                            </div>
                            <div>
                                Quy định đổi hàng
                            </div>
                            <div>
                                Quy định bảo hành và sửa chữa
                            </div>
                            <div>
                                Khách hàng thân thiết
                            </div>

                        </div>

                    </div>
                    <div className="footer-navbar-item">
                        <div className="navbar-item-title">
                            FANPAGE CHÚNG TÔI
                        </div>
                        <div>

                            <a href="https://www.facebook.com/linhha2001" style={{ margin: '10px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/2048px-2021_Facebook_icon.svg.png" alt="" style={{ width: '40px' }} />
                            </a>
                            <a href="https://www.youtube.com/watch?v=AQW_NgPOnx0" style={{ margin: '10px' }}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="" style={{ width: '40px', }} />
                            </a>
                            <a href="https://www.instagram.com/hust_dhbkhanoi/" style={{ margin: '10px' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/768px-Instagram_icon.png" alt="" style={{ width: '40px', }} />
                            </a>
                        </div>
                    </div>
                </div>


            </div>


        </div>
    )
}
export default Footer;
