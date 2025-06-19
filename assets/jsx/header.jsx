import { h, Fragment } from 'preact';
import habitat from 'preact-habitat';
import { useState } from 'preact/hooks';
import SwitchTheme from 'jsx/switchTheme';

function Header({ siteTitle, menuItems }) {
  const [menuActive, setMenuActive] = useState(false);
  const [openSubmenuIndex, setOpenSubmenuIndex] = useState(null);

  const handleToggleClick = () => {
    setMenuActive(prev => !prev);
    setOpenSubmenuIndex(null);
  };

  const handleMenuItemClick = (index) => {
    setOpenSubmenuIndex(prev => (prev === index ? null : index));
  };

  return (
		<nav class="main-nav">
			<a class="logo" href="/">{siteTitle}</a>
			<ul class={`menu${menuActive ? ' menu--active' : ''}`}>
				{menuItems.map((item, idx) => (
					<li class="menu-item" key={idx}>
						{item.children ? (
							<>
								<span class="menu-link" onClick={() => handleMenuItemClick(idx)}>
									{item.name} <span class="drop-icon">▾</span>
								</span>
								<ul class={`sub-menu${openSubmenuIndex === idx ? ' sub-menu--active' : ''}`}>
									{item.children.map((child, subIdx) => (
										<li class="menu-item" key={subIdx}>
											<a href={child.url} class="menu-link">{child.name}</a>
										</li>
									))}
								</ul>
							</>
						) : (
							<a href={item.url} class="menu-link">{item.name}</a>
						)}
					</li>
				))}
					{/* <li class="menu-link"> */}
						<SwitchTheme/>
          {/* </li> */}
			</ul>

			<span class="nav-toggle" onClick={handleToggleClick}>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" fill="var(--color-contrast-high)">
					<rect y="11" width="24" height="2" rx="1"/>
					<rect y="4" width="24" height="2" rx="1"/>
					<rect y="18" width="24" height="2" rx="1"/>
				</svg>
			</span>
		</nav>
  );
}

export default (() => {
	// Mount the SwitchTheme Component on Import
	habitat(Header).render({selector:'.header-theme-mount', clean:true});
})();

