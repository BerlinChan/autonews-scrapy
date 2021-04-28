import { RouteConfig } from "src/shared/models/routeModels";
import { ReactElement } from "react";
import { Layout, Menu } from "antd";
import cls from "./Layout.module.scss";
import { Link, useLocation } from "react-router-dom";
import logo from "./autonews-logo.png";

const { Header, Content, Footer } = Layout;

const LayoutComponent = ({ children }: RouteConfig): ReactElement => {
  const {pathname} = useLocation();
  console.log("🚀 ~ file: Layout.tsx ~ line 12 ~ LayoutComponent ~ pathname", pathname)

  return (
    <Layout>
      <Header className={cls.header}>
        <div className={cls.logo}>
          <a href="https://autonews.berlinchan.com/">
            <img src={logo} alt="新闻源监控" />
            <span className={cls.logoTitle}>新闻源监控</span>
          </a>
        </div>

        <div className={cls.horizontalMenu}>
          {
            <Menu
              theme="dark"
              mode={"horizontal"}
              selectedKeys={[pathname]}
              className={cls.menu}
            >
              <Menu.Item key="/">
                <Link to="/">当日监控</Link>
              </Menu.Item>
              <Menu.Item key="/pastInquiry">
                <Link to="/pastInquiry">往期查询</Link>
              </Menu.Item>
              <Menu.Item key="/filter">
                <Link to="/filter">筛选</Link>
              </Menu.Item>
              <Menu.Item key="/setting">
                <Link to="/setting">设置</Link>
              </Menu.Item>
              <Menu.Item key="/about">
                <Link to="/about">关于</Link>
              </Menu.Item>
              <Menu.Item key="/demo">
                <Link to="/demo">demo</Link>
              </Menu.Item>
            </Menu>
          }
        </div>
      </Header>
      <Content className={cls.content}>{children}</Content>
      <Footer className={cls.footer}>
        <span>
          监控服务:&nbsp;
          {
            // this.props.global.get('socketConnectStatus') === 'disconnect'
            true ? (
              <span className={cls.warning}>停机</span>
            ) : (
              <span>运行中</span>
            )
          }
        </span>
        {/*
     &nbsp;|&nbsp;<span>有 {this.props.global.get('clientCount')} 位小编在线</span>
     */}
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;
