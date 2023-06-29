import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AppBar,
    Badge,
    Box,
    Button,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import "./NavBar.css";
import { userType } from "@feria-a-ti/common/model/functionsTypes";
import { UserContext } from "@feria-a-ti/web/src/App";

function NavBar() {
    //Context variables
    const { authUser, type, productQuantity, resetSession } =
        useContext(UserContext);
    //Navigation definition
    const navigate = useNavigate();

    const clearAuth = () => {
        resetSession && resetSession();
    };

    const pages = [
        {
            label: "HOME",
            action: () => {
                console.log("HOME ACTION");
                navigate(type === "vendor" ? "managerVendor" : "home");
            },
        },
    ];
    const settings = [
        {
            label: "Home",
            action: () => {
                navigate("/session");
            },
        },
        {
            label: "Account",
            action: () => {
                navigate("/accountPage");
            },
        },
        {
            label: "Logout",
            action: () => {
                clearAuth();
                navigate("/");
            },
        },
    ];

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const isVendorPage =
        window.location.pathname.includes("Vendor") || type === userType.vendor;

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar
            color={
                type == userType.undefined
                    ? isVendorPage
                        ? "primary"
                        : "secondary"
                    : type == userType.vendor
                    ? "primary"
                    : "secondary"
            }
            position="static"
            sx={{ top: 0 }}
        >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon
                        sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        onClick={() =>
                            navigate(isVendorPage ? "/loginVendor" : "/")
                        }
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        LOGO
                    </Typography>
                    {authUser !== "" && (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "none" },
                            }}
                        >
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                            >
                                {settings.map((page) => (
                                    <MenuItem
                                        key={page.label}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            page.action();
                                        }}
                                    >
                                        <Typography textAlign="center">
                                            {page.label}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    )}
                    <AdbIcon
                        sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                    />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        onClick={() =>
                            navigate(isVendorPage ? "/loginVendor" : "/")
                        }
                        sx={{
                            mr: 2,
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontFamily: "monospace",
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        LOGO
                    </Typography>
                    {(authUser !== "" && (
                        <>
                            <Box
                                sx={{
                                    flexGrow: 1,
                                    display: { xs: "none", md: "flex" },
                                }}
                            >
                                {pages.map((page) => (
                                    <Button
                                        key={page.label}
                                        onClick={() => {
                                            handleCloseNavMenu();
                                            page.action();
                                        }}
                                        sx={{
                                            my: 2,
                                            color: "white",
                                            display: "block",
                                        }}
                                    >
                                        {page.label}
                                    </Button>
                                ))}
                            </Box>

                            <Box sx={{ flexGrow: 0 }}>
                                {userType.user == type && (
                                    <Tooltip
                                        title="Carro de productos"
                                        sx={{ p: 0, marginRight: "1em" }}
                                    >
                                        <IconButton
                                            size="large"
                                            aria-label="shopping cart of current session"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            color="inherit"
                                            onClick={() =>
                                                navigate("/shoppingCart")
                                            }
                                        >
                                            <Badge
                                                badgeContent={productQuantity}
                                                color="primary"
                                            >
                                                <ShoppingCartIcon />
                                            </Badge>
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip title="Abrir opciones">
                                    <IconButton
                                        size="large"
                                        aria-label="account of current user"
                                        aria-controls="menu-appbar"
                                        aria-haspopup="true"
                                        color="inherit"
                                        onClick={handleOpenUserMenu}
                                        sx={{ p: 0 }}
                                    >
                                        <AccountCircle />
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{ mt: "45px" }}
                                    id="menu-appbar"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "right",
                                    }}
                                    open={Boolean(anchorElUser)}
                                    onClose={handleCloseUserMenu}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem
                                            key={setting.label}
                                            onClick={() => {
                                                setting.action();
                                                handleCloseUserMenu();
                                            }}
                                        >
                                            <Typography textAlign="center">
                                                {setting.label}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </>
                    )) || (
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: "flex", md: "flex" },
                                direction: "rtl",
                            }}
                        >
                            <Typography
                                variant="body1"
                                noWrap
                                component="a"
                                onClick={() =>
                                    navigate(isVendorPage ? "/" : "loginVendor")
                                }
                                sx={{
                                    mr: 2,
                                    display: { xs: "flex", md: "flex" },
                                    fontFamily: "monospace",
                                    fontWeight: 400,
                                    letterSpacing: ".05rem",
                                    color: "inherit",
                                    textDecoration: "none",
                                }}
                            >
                                {isVendorPage
                                    ? "IR A ACCESO DE COMPRADOR"
                                    : "IR A ACCESO DE VENDEDOR"}
                            </Typography>
                        </Box>
                    )}
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default NavBar;
