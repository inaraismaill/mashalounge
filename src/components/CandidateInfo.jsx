import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom";
import manAvatar from '../assets/manAvatar.png'
import '../styles/CandidateInfo.css'
import { FaStar } from "react-icons/fa";
import { TbCurrencyManat } from "react-icons/tb";
import 'react-tooltip/dist/react-tooltip.css'
import { Tooltip } from 'react-tooltip'
import { FaCircleInfo } from "react-icons/fa6";
import { CandidateService } from "../services/candidateService";
import { TeaCounterService } from "../services/teaCounterService";
import { OrderService } from "../services/orderService";
import { ImGift } from "react-icons/im";
import TeaIcon from '../assets/tea-pot.png'
import QelyanIcon from '../assets/hookah.png'
import BlackKettleIcon from '../assets/kettle.png'
import 'react-multi-carousel/lib/styles.css';
const flexColAlignCenter = { display: 'flex', flexDirection: 'column', alignItems: 'center' };
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { PresentServie } from "../services/presentService";

function Avatar({ url }) {
    return (
        <div className="avatarWrapper">
            <img src={manAvatar} alt="Profile photo" />
        </div>
    )
}
function FullNameAndId({ fullName, id, marginTop }) {
    return (
        <div style={{ ...flexColAlignCenter, marginTop: marginTop, gap: 5 }}>
            <h4 className="whiteColor">{fullName}</h4>
            <h5 style={{ textTransform: 'uppercase', fontWeight: 400 }} className="whiteLowOpacity">{id}</h5>
        </div>
    )
}

function UserRating({ rating, rank, marginTop }) {
    const starArr = [1, 2, 3, 4, 5];
    return (
        <div style={{ ...flexColAlignCenter, marginTop: marginTop }}>
            <h4 style={{ fontWeight: 400 }} className="whiteColor">{rank}</h4>
            <div className="starsWrapper">
                {starArr.map((star) => {
                    return (
                        <FaStar key={star} size={20} fill={rating >= star ? '#ffae42' : 'white'} />
                    )
                })}
            </div>
        </div>
    )

}

function TeaAndQelyanGifts({ gifts }) {
    var settings = {
        dots: false,
        infinite: gifts.length == 1 ? false : true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
    };
    return (
        <div className="slider-container">
            <Slider {...settings}>
                {gifts.map((gift) => {
                return (
                    <div key={gift.id} style={{ width: 50, height: 50}}>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 10}}>
                            <img style={{ width: 30, height: 30 }} src={gift.name === 'Çay' ? TeaIcon : QelyanIcon} />
                            <span style={{color: 'white'}}>
                                {gift.name}
                            </span>
                        </div>
                        <span style={{
                            position: 'absolute',
                            color: 'white',
                            right: gift.name === "Çay" ? 40 : 60,
                            bottom: -6,
                            fontSize: 16,
                        }}>
                            {gift.count}
                        </span>
                    </div>
                )
            })}
            </Slider>
        </div>
    )
}
function BalanceAndBonus({ balance, bonus, marginTop, gifts }) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: marginTop }}>
            <div style={{ ...flexColAlignCenter }}>
                <h5 className="whiteColor">Cashback</h5>
                <h6 className="whiteLowOpacity" style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 400 }}>
                    {balance}
                    <TbCurrencyManat />
                </h6>
            </div>
            <div style={{ ...flexColAlignCenter }}>
                <h5 className="whiteColor">Hədiyyə</h5>
                {!gifts || gifts.length === 0 && (
                    <h6 className="whiteLowOpacity" style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 400 }} >
                        Hədiyyəniz yoxdur <ImGift />
                    </h6>
                )}
                <TeaAndQelyanGifts gifts={gifts} />
            </div>
        </div >
    )
}

function BonusProgress({ count }) {
    return (
        <div style={{ width: '90%', maxWidth: 500 }}>
            <div className="progressDiv">
                <h5 style={{ color: 'tomato', display: 'flex', alignItems: 'center', gap: 3 }}>
                    <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="10 çay aldıqda, 1 -i bizdən!  :)"
                        data-tooltip-place="top"
                    >
                        <FaCircleInfo />
                    </a>
                    <Tooltip id="my-tooltip" />
                </h5>
                <div className="progressBar">
                    <div style={{ '--progress-percentage': `${count * 10}%` }} className="progressBarInner">{count}</div>
                </div>
            </div>
        </div>
    )
}
function BonusDefinitionCard() {
    return (
        <div style={{ width: '90%', maxWidth: 300 }}>
            <div style={{display: 'flex', flexDirection: 'row',alignItems: 'center', gap: 20, borderRadius: 20}} className="progressDiv">
                <div style={{height: 50, display: 'flex', flexDirection: 'row',alignItems: 'center', gap: 10}}>
                    <img style={{height: 40}} src={BlackKettleIcon}/>
                    <div className="nmBorder"></div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',width: '100%'}}>
                    <h5 style={{margin: 0, fontWeight: 400, color: 'black'}}>10 çay alana</h5>
                    <h4 style={{margin: 0, fontWeight: 400, color: 'orange'}}>1 çay HƏDİYYƏ</h4>
                </div>
            </div>
        </div>
    )
}
export default function CandidateInfo() {
    const { id: userId } = useParams();
    const [user, setUser] = useState({});
    const [teaCount, setTeaCount] = useState(0)
    const [starDetail, setStarDetail] = useState({});
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate()
    useEffect(() => {

        // Candidate Detail
        const candidateService = new CandidateService();

        candidateService.findByCandidateId(userId).then(res => setUser(res.data.data)).catch(e => {
            navigate("/*")
        })

        // Tea count
        const teaCounterService = new TeaCounterService()

        teaCounterService.findByCandidateId(userId).then(res => setTeaCount(res.data.data))

        // Star count
        const orderService = new OrderService()

        orderService.countByCandidateId(userId).then(res => setStarDetail(res.data.data))

        // Present

        const presentService = new PresentServie()

        presentService.findByCandidateIdAndStatusIsTrue(userId).then(res => setGifts(res.data.data))
    }, [])

    return (
        <div className="candidatePage">
            <h1 className="pageTitle">Masha Lounge</h1>
            <h2 className="pageTitle">Müştəri kodu: <span style={{ textTransform: 'uppercase' }}>{userId}</span></h2>
            <div className="infoContainer">
                <div style={{ ...flexColAlignCenter }}>
                    <Avatar />
                    <FullNameAndId fullName={user.firstName + " " + user.lastName} id={userId} marginTop={15} />
                    <UserRating rating={starDetail.count} rank={starDetail.rank} marginTop={30} />
                    <div style={{marginTop: 15}}>
                        <h4 style={{color: 'white'}}>{user.cashbackPercent}% cashback</h4>
                    </div>
                </div>
                <BalanceAndBonus gifts={gifts} balance={user.cashBack} bonus={0} marginTop={80} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column',justifyContent: 'center', alignItems: 'center',gap:15,marginTop: 30}}>
                <BonusProgress count={teaCount} />
                <BonusDefinitionCard />
            </div>

        </div>
    )
}
