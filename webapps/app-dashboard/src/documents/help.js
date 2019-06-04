import React, { Component } from 'react';

const style = {
  image: {
    height: 500
  },
};

export default class DocHelp {
  // CreateNewApp
	static appTypePicker = ()=>(
    <div>
      <div><b>Library Only</b> — Your users will access a library of general content. Primarily for educational use.</div>
      <div><b>Personal Plan Only</b> — Your users will only view content chosen specifically for them in a private plan.</div>
      <div><b>Library + Personal Plan</b> — Your users will view content that is a mix of general and private content.</div>
    </div>
  )
	static templatePicker = ()=>(
    <div>Click the arrow to choose your profession from the pull-down menu</div>
  )

  // AppDetailViewer
  static appName = ()=>(
    <div>
      <p>This will be the name on the cover of your Playbook App</p>
      <img style={style.image} alt="Playbook App Cover" src={require('../resources/info/info-title.gif')}/>
    </div>
  )
	static appCode = ()=>(
    <div>
      <p>Your patients/clients will use this code to find your Playbook App</p>
      <img style={style.image} alt="Enter Playbook App Code" src={require('../resources/info/info-appcode.gif')}/>
    </div>
  )
	static author = ()=>(
    <div>
      <p>This will show on the cover of your Playbook App</p>
      <img style={style.image} alt="Playbook App Cover" src={require('../resources/info/info-author.gif')}/>
    </div>
  )
  static appDesc = ()=>(
    <div>
      <p>Description of your Playbook App</p>
      <img style={style.image} alt="Playbook App" src={require('../resources/info/info-description.gif')}/>
    </div>
  )
	static coverImage = ()=>(
    <div>User your own image as custom cover</div>
  )
  static authorPhoto = ()=>(
		<div>
      <p>This will show when your patients/clients try to communicate with you</p>
			<img style={style.image} alt="Provider Profile Photo" src={require('../resources/info/info-profilephoto.png')}/>
    </div>
  )
  static logoImage = ()=>(
    <div>
      <p>Logo design in your Playbook App</p>
      <img style={style.image} alt="Customize Logo" src={require('../resources/info/info-logo.gif')}/>
    </div>
  )
	static websiteUrl = ()=>(
    <div>
      <p>Your users can go to this website from their Playbook App</p>
			<img style={style.image} alt="Provider Website" src={require('../resources/info/info-website.png')}/>
    </div>
  )
	static lockDownload = ()=>(
    <div>
      <p>Your patients/clients will not be able to download your Playbook App without this code.</p>
      <img style={style.image} alt="Lock Download" src={require('../resources/info/info-lockdownload.png')}/>
    </div>
  )
  static lockActions = ()=>(
    <div>
      <p>Your Playbook App is locked by this code, so your patients/clients will not be able to add/remove/reorder instructions.</p>
      <img style={style.image} alt="Lock User Actions" src={require('../resources/info/info-lock.gif')}/>
    </div>
  )
	static libraryButton = ()=>(
    <div>To Add General Instructions for All of Your Patients/Clients</div>
  )

	static organizationLogo = ()=>(
		<div>
			<div> This Image will be used as Logo for the organization, displayed to all organization members.  </div>
		</div>
	)

	static organizationPlaybookCover = ()=>(
		<div>
			<p> {"This Image will be used as cover image for any organization member's playbooks."} </p>
		</div>
	)
}
