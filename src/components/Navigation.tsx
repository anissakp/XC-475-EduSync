import eduSyncLogo from "../assets/edusyncLogo.png"

export default function Navigation() {
  return (
    <div className="flex justify-between items-center">
      <img src={eduSyncLogo} alt="logo"/>
      <nav>
        <ul className="flex">
          <li>Meet the team</li>
          <li>About us</li>
          <li><button>LOGIN</button></li>
        </ul>
      </nav>
    </div>
  )
}