import * as React from "react";
import {
  Navbar,
  NavbarItem,
  NavbarSection,
  NavbarSpacer,
} from "@/components/ui/navbar";
import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "@/components/ui/dropdown";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "@/components/ui/sidebar";
import { SidebarLayout } from "@/components/ui/sidebar-layout";
import {
  BarcodeIcon,
  ChevronUpIcon,
  UsersIcon,
  UserRoundCogIcon,
  NotebookTextIcon,
  PanelTopIcon,
  ReceiptTextIcon,
  StarIcon,
  SquareStackIcon,
  TicketIcon,
  SmilePlusIcon,
  TicketsIcon,
  LayoutTemplateIcon,
  HomeIcon,
  LayersIcon,
  PackagePlusIcon, PackageCheckIcon, TruckIcon, ClipboardCheckIcon, BikeIcon,
} from "lucide-react";

import UserContext from "./contexts/user-context.ts";

export default function Layout({ children }) {
  const currentUser = React.use(UserContext);
  return (
    <SidebarLayout
      navbar={null}
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection>
              <SidebarItem to="/">
                <HomeIcon />
                <SidebarLabel>메인</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarHeading>상품관련</SidebarHeading>
              <SidebarItem to="/product-categories">
                <SquareStackIcon />
                <SidebarLabel>상품 카테고리</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/products">
                <BarcodeIcon />
                <SidebarLabel>상품</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/product-content-blocks">
                <LayoutTemplateIcon />
                <SidebarLabel>상세페이지 템플릿</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/product-additional-groups">
                <PackagePlusIcon />
                <SidebarLabel>추가 상품 그룹</SidebarLabel>
              </SidebarItem>
              <SidebarItem to="/reviews">
                <StarIcon />
                <SidebarLabel>리뷰</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>주문</SidebarHeading>
              <SidebarItem to="/orders">
                <ReceiptTextIcon />
                <SidebarLabel>주문</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/worksheet">
                <ClipboardCheckIcon />
                <SidebarLabel>작업계획서</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/shipping-management">
                <PackageCheckIcon />
                <SidebarLabel>출고</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>배송</SidebarHeading>
              <SidebarItem to="/delivery-methods">
                <TruckIcon />
                <SidebarLabel>배송방법</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/quick-tasks">
                <BikeIcon />
                <SidebarLabel>퀵 배차 현황</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>홈페이지</SidebarHeading>
              <SidebarItem to="/banners">
                <PanelTopIcon />
                <SidebarLabel>배너 관리</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/promotion-categories">
                <LayersIcon />
                <SidebarLabel>맞춤형 추천상품 섹션</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/promotion-sections">
                <LayersIcon />
                <SidebarLabel>프로모션 섹션</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/sns-sections">
                <LayersIcon />
                <SidebarLabel>인스타그램 섹션</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/promotion-pages">
                <NotebookTextIcon />
                <SidebarLabel>프로모션 페이지</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>혜택</SidebarHeading>
              <SidebarItem to="/coupons">
                <TicketIcon />
                <SidebarLabel>쿠폰</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/user-coupons">
                <TicketsIcon />
                <SidebarLabel>쿠폰 발급 현황</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/points">
                <SmilePlusIcon />
                <SidebarLabel>적립금</SidebarLabel>
              </SidebarItem>
            </SidebarSection>

            <SidebarSection>
              <SidebarHeading>유저</SidebarHeading>
              <SidebarItem to="/users">
                <UsersIcon />
                <SidebarLabel>사용자</SidebarLabel>
              </SidebarItem>

              <SidebarItem to="/admin-users">
                <UserRoundCogIcon />
                <SidebarLabel>관리자</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter>
            <Dropdown>
              <DropdownButton as={SidebarItem}>
                <div className="grow flex min-w-0 items-center gap-3">
                  <span className="min-w-0">
                    <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                      {currentUser.name}
                    </span>
                    <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                      {currentUser.username}
                    </span>
                  </span>
                </div>
                <ChevronUpIcon />
              </DropdownButton>
              <DropdownMenu className="min-w-64" anchor="top start">
                <DropdownItem to="/my-profile">
                  {/*<UserIcon />*/}
                  <DropdownLabel>정보수정</DropdownLabel>
                </DropdownItem>
                <DropdownItem to="/my-profile">
                  {/*<UserIcon />*/}
                  <DropdownLabel>로그아웃</DropdownLabel>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
