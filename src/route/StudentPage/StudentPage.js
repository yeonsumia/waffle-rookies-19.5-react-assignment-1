import './StudentPage.css'
import {useParams} from "react-router-dom";
import {useUserContext} from '../../context/UserContext'
import {Link} from 'react-router-dom'
import Confirm from '../../components/Confirm/Confirm'
import NumberFormat from 'react-number-format';
import toBackImg from '../../resource/toBack.png';
import lockImg from '../../resource/lock.png'
import unlockImg from '../../resource/unlockImg.png'
import deleteImg from '../../resource/delete.png'
import saveImg from '../../resource/save.png'
import lockProfileImg from '../../resource/lockProfile.png'

import {useState} from "react";
const StudentPage = () => {
    const {tableList, setTableList} = useUserContext();
    const params = useParams();
    const id = parseInt(params.id);
    const student = tableList.find(user => user.id === id);
    const [inputs, setInputs] = useState({
        profileImg: tableList.find(user => user.id === id).profileImg,
        email: tableList.find(user => user.id === id).email.split('@')[0],
        phone: tableList.find(user => user.id === id).phone,
        major: tableList.find(user => user.id === id).major
    });
    const {profileImg, email, phone, major} = inputs;
    const initialImg ="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-1024.png";
    const [lock, setLock] = useState(false);
    const [deleteModal,setDeleteModal] = useState(false);
    const onClick = () => {
        setLock(lock => !lock);
    }
    const onChange = (e) => {
        const {value, name} = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
        // auto format 으로 인해 010- 이 추가될 때 커서 맨 뒤로 이동시키기.
        e.target.selectionStart = e.target.value.length;
    }
    const onToggle = () => {
        if(email.includes("@") || email.includes(" ")){
            alert("이메일 주소의 형식이 올바르지 않습니다.")
            return null;
        }
        if(phone.length !== 13){
            alert("전화번호의 형식이 올바르지 않습니다.")
            return null;
        }
        setTableList(
            tableList.map(user =>
                user.id === id ? {...user, profileImg, email: email+"@waffle.hs.kr", phone, major}: user)
        )
    }


    const limit = (val) => {
        if(val.length === 1 && val[0] !== '0'){
            val = '010' + val;
        }
        if(val.length >= 2 && val.substring(0,2) !== '01'){
            val = '010' + val;
        }
        if(val.length === 3 && val.substring(0,3) !== '010'){
            val = '010' + val;
        }
        return val;
    }

    const phoneFormat = (val) => {
        const header = limit(val.substring(0,3));
        const content = val.substring(3,7);
        const footer = val.substring(7,11);
        return header + (content.length ? '-' + content : '') + (footer.length ? '-' + footer : '');
    }
    return (
        <div className="StudentPageWrapper">
                <div className="ToBackWrapper">
                    <div className="ToBackImgWrapper">
                        <Link to="/students">
                            <img src={toBackImg} className="ToBackImg"/>
                        </Link>
                    </div>
                    <div className="ToBackText">학생 목록 페이지로</div>
                </div>
                <div className="StudentImgWrapper">
                    <img className="StudentImg" src={profileImg !== ''? profileImg: initialImg} />
                </div>
                <div className="StudentInfoWrapper">
                    <div className="StudentInfoNameWrapper">
                        <div className="StudentInfoNameText">이름</div>
                        <input className="StudentInfoNameInput" value={student.name} name="name" onChange={onChange} disabled/>
                    </div>
                    <div className="StudentInfoGradeWrapper">
                        <div className="StudentInfoGradeText">학년</div>
                        <input className="StudentInfoGradeInput" value={student.grade} name="grade" onChange={onChange} disabled/>
                    </div>
                </div>
                <div className="lockIconWrapper">
                    <div className="lockIcon" onClick={onClick}>
                        <div className="lockIconImgWrapper">
                            <img src={lock? unlockImg:lockImg} className="lockIconImg"/>
                        </div>
                        <div className="lockIconText">{lock? "해제":"잠금"}</div>
                    </div>
                </div>
                <div className="deleteIconWrapper">
                    <div className={lock? "lockedDeleteIcon" : "deleteIcon" } onClick={lock? null : () => setDeleteModal(state => !state)}>
                        <div className="deleteIconImgWrapper">
                            <img src={deleteImg} className="deleteIconImg"/>
                        </div>
                        <div className="deleteIconText">삭제</div>
                    </div>
                </div>
                <div className="saveIconWrapper">
                    <div className={lock? "lockedSaveIcon" : "saveIcon" } onClick={lock? null : onToggle}>
                        <div className="saveIconImgWrapper">
                            <img src={saveImg} className="saveIconImg"/>
                        </div>
                        <div className="saveIconText">저장</div>
                    </div>
                </div>

                <div className="infoBox">
                    <div className="infoBoxText">정보</div>
                </div>
                <div className="infoContent">
                    <div className="infoContentBox">
                        <div className="infoContentPhone">
                            <div className="infoContentPhoneText">전화번호</div>
                            <div className="infoContentPhoneInputBox">
                                <NumberFormat format={phoneFormat} className="infoContentPhoneInput" value={phone} name="phone" onChange={onChange} />
                            </div>
                        </div>
                        <div className="infoContentEmail">
                            <div className="infoContentEmailText">이메일</div>
                            <div className="infoContentEmailInputBox">
                                <input className="infoContentEmailInput" value={email} name="email" onChange={onChange}/>
                                <div className="infoContentEmailInputText">@waffle.hs.kr</div>
                            </div>

                        </div>
                        <div className="infoContentMajor">
                            <div className="infoContentMajorText">전공</div>
                            <div className="infoContentMajorSelectBox">
                                <select className="infoContentMajorSelect" value={major} name="major" onChange={onChange}>
                                    <option value="frontend">frontend</option>
                                    <option value="backend">backend</option>
                                    <option value="android">android</option>
                                    <option value="iOS">iOS</option>
                                    <option value="design">design</option>
                                </select>
                            </div>
                        </div>
                        <div className="infoContentProfile">
                            <div className="infoContentProfileText">프로필</div>
                            <div className="infoContentProfileInputBox">
                                <input className="infoContentProfileInput" onChange={onChange}/>
                            </div>
                        </div>
                    </div>
                    {lock?
                        <div className="lockedInfoContent">
                            <img src={lockProfileImg} className="lockedInfoImg"/>
                            <div className="lockedInfoText">수정하려면 잠금을 해제하세요.</div>
                        </div>
                        : null}

                </div>
                <div className="commentBox">
                    <div className="commentBoxText">코멘트</div>
                </div>
                <div className="commentContent">
                    <div className="commentContentText">과제 3에서 구현</div>
                </div>
            <Confirm deleteModal={deleteModal} setDeleteModal={setDeleteModal} />

        </div>
    )
}
export default StudentPage