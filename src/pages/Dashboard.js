import { useDispatch, useSelector } from "react-redux"
import { Outlet } from "react-router-dom"

import Sidebar from "../components/core/Dashboard/Sidebar"
import ConfirmationModal from "../components/common/ConfirmationModal"
import { useEffect, useState } from "react";
import Tab from "../components/common/Tab";
import { ACCOUNT_TYPE } from "../utils/constants";
import { setUserAccountType } from "../services/operations/authAPI";

function Dashboard() {
  const {user, loading: profileLoading } = useSelector((state) => state.profile);
  const {token, loading: authLoading } = useSelector((state) => state.auth);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);
  const dispatch = useDispatch();
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];
  
  useEffect(()=>{ //for google sign up
    if(token && !user.accountType){
      setConfirmationModal({
        text1: "Select Your Account Type",
        text2: "Selecting one out of Student or Instructor in mandatory",
        btn1Text: "Confirm",
        children: <div><p className="translate-y-2 text-[12px] text-yellow-100">AccountType cannot be changed once selected*</p><Tab tabData={tabData} field={accountType} setField={setAccountType} /></div>,
        btn1Handler: () => {
          dispatch(setUserAccountType(accountType, token));
        }
      })
    }
    else{
      setConfirmationModal(null);
    }
    // eslint-disable-next-line
  },[accountType, user]);
  
  if (profileLoading || authLoading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <Sidebar />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-auto w-11/12 max-w-[1000px] py-10">
            <Outlet />
          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default Dashboard