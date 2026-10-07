import { Component, input } from '@angular/core';
import {
  LucideActivity,
  LucideArrowDown,
  LucideArrowLeft,
  LucideArrowRight,
  LucideArrowUp,
  LucideArrowUpDown,
  LucideAward,
  LucideBackpack,
  LucideBan,
  LucideBell,
  LucideBike,
  LucideBox,
  LucideBuilding2,
  LucideCalendar,
  LucideCalendarRange,
  LucideCamera,
  LucideChartColumn,
  LucideCheck,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideCircle,
  LucideCircleAlert,
  LucideCircleCheck,
  LucideCircleCheckBig,
  LucideCircleX,
  LucideClipboardList,
  LucideClock,
  LucideCloud,
  LucideCodeXml,
  LucideCompass,
  LucideCopy,
  LucideCpu,
  LucideDatabase,
  LucideDollarSign,
  LucideDownload,
  LucideEllipsisVertical,
  LucideEye,
  LucideEyeOff,
  LucideFileCode,
  LucideFilePen,
  LucideFileText,
  LucideFlame,
  LucideFootprints,
  LucideGitBranch,
  LucideGlobe,
  LucideHand,
  LucideHeadphones,
  LucideHeart,
  LucideInfo,
  LucideKeyRound,
  LucideLaptop,
  LucideLayers,
  LucideLayoutDashboard,
  LucideLayoutGrid,
  LucideLeaf,
  LucideLightbulb,
  LucideList,
  LucideListFilter,
  LucideLoaderCircle,
  LucideLock,
  LucideLockKeyhole,
  LucideLogIn,
  LucideLogOut,
  LucideMail,
  LucideMailCheck,
  LucideMap,
  LucideMapPin,
  LucideMenu,
  LucideMessageSquare,
  LucideMessageSquareWarning,
  LucideMinus,
  LucideMonitor,
  LucideMonitorSmartphone,
  LucideMoon,
  LucideMountain,
  LucideMountainSnow,
  LucidePackage,
  LucidePackageOpen,
  LucidePalette,
  LucidePercent,
  LucidePhone,
  LucidePlus,
  LucideRefreshCw,
  LucideSave,
  LucideScan,
  LucideSearch,
  LucideSend,
  LucideServer,
  LucideSettings,
  LucideShield,
  LucideShieldAlert,
  LucideShieldCheck,
  LucideShoppingBag,
  LucideShoppingCart,
  LucideSlidersHorizontal,
  LucideSmartphone,
  LucideSparkles,
  LucideSquarePen,
  LucideStar,
  LucideSun,
  LucideTablet,
  LucideTag,
  LucideTarget,
  LucideTent,
  LucideTentTree,
  LucideTerminal,
  LucideToggleLeft,
  LucideTrash2,
  LucideTreePine,
  LucideTrees,
  LucideTrendingDown,
  LucideTrendingUp,
  LucideTriangleAlert,
  LucideTruck,
  LucideUpload,
  LucideUser,
  LucideUserCheck,
  LucideUserPlus,
  LucideUserRound,
  LucideUsers,
  LucideWind,
  LucideX,
  LucideZap,
} from '@lucide/angular';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [
    LucideActivity,
    LucideArrowDown,
    LucideArrowLeft,
    LucideArrowRight,
    LucideArrowUp,
    LucideArrowUpDown,
    LucideAward,
    LucideBackpack,
    LucideBan,
    LucideBell,
    LucideBike,
    LucideBox,
    LucideBuilding2,
    LucideCalendar,
    LucideCalendarRange,
    LucideCamera,
    LucideChartColumn,
    LucideCheck,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideCircle,
    LucideCircleAlert,
    LucideCircleCheck,
    LucideCircleCheckBig,
    LucideCircleX,
    LucideClipboardList,
    LucideClock,
    LucideCloud,
    LucideCodeXml,
    LucideCompass,
    LucideCopy,
    LucideCpu,
    LucideDatabase,
    LucideDollarSign,
    LucideDownload,
    LucideEllipsisVertical,
    LucideEye,
    LucideEyeOff,
    LucideFileCode,
    LucideFilePen,
    LucideFileText,
    LucideFlame,
    LucideFootprints,
    LucideGitBranch,
    LucideGlobe,
    LucideHand,
    LucideHeadphones,
    LucideHeart,
    LucideInfo,
    LucideKeyRound,
    LucideLaptop,
    LucideLayers,
    LucideLayoutDashboard,
    LucideLayoutGrid,
    LucideLeaf,
    LucideLightbulb,
    LucideList,
    LucideListFilter,
    LucideLoaderCircle,
    LucideLock,
    LucideLockKeyhole,
    LucideLogIn,
    LucideLogOut,
    LucideMail,
    LucideMailCheck,
    LucideMap,
    LucideMapPin,
    LucideMenu,
    LucideMessageSquare,
    LucideMessageSquareWarning,
    LucideMinus,
    LucideMonitor,
    LucideMonitorSmartphone,
    LucideMoon,
    LucideMountain,
    LucideMountainSnow,
    LucidePackage,
    LucidePackageOpen,
    LucidePalette,
    LucidePercent,
    LucidePhone,
    LucidePlus,
    LucideRefreshCw,
    LucideSave,
    LucideScan,
    LucideSearch,
    LucideSend,
    LucideServer,
    LucideSettings,
    LucideShield,
    LucideShieldAlert,
    LucideShieldCheck,
    LucideShoppingBag,
    LucideShoppingCart,
    LucideSlidersHorizontal,
    LucideSmartphone,
    LucideSparkles,
    LucideSquarePen,
    LucideStar,
    LucideSun,
    LucideTablet,
    LucideTag,
    LucideTarget,
    LucideTent,
    LucideTentTree,
    LucideTerminal,
    LucideToggleLeft,
    LucideTrash2,
    LucideTreePine,
    LucideTrees,
    LucideTrendingDown,
    LucideTrendingUp,
    LucideTriangleAlert,
    LucideTruck,
    LucideUpload,
    LucideUser,
    LucideUserCheck,
    LucideUserPlus,
    LucideUserRound,
    LucideUsers,
    LucideWind,
    LucideX,
    LucideZap,
  ],
  template: `
    @switch (name()) {
      @case ('activity') {
        <svg lucideActivity [size]="size()"></svg>
      }
      @case ('circle-alert') {
        <svg lucideCircleAlert [size]="size()"></svg>
      }
      @case ('triangle-alert') {
        <svg lucideTriangleAlert [size]="size()"></svg>
      }
      @case ('arrow-left') {
        <svg lucideArrowLeft [size]="size()"></svg>
      }
      @case ('arrow-right') {
        <svg lucideArrowRight [size]="size()"></svg>
      }
      @case ('arrow-up-down') {
        <svg lucideArrowUpDown [size]="size()"></svg>
      }
      @case ('award') {
        <svg lucideAward [size]="size()"></svg>
      }
      @case ('backpack') {
        <svg lucideBackpack [size]="size()"></svg>
      }
      @case ('ban') {
        <svg lucideBan [size]="size()"></svg>
      }
      @case ('bar-chart-3') {
        <svg lucideChartColumn [size]="size()"></svg>
      }
      @case ('bell') {
        <svg lucideBell [size]="size()"></svg>
      }
      @case ('bike') {
        <svg lucideBike [size]="size()"></svg>
      }
      @case ('building-2') {
        <svg lucideBuilding2 [size]="size()"></svg>
      }
      @case ('calendar') {
        <svg lucideCalendar [size]="size()"></svg>
      }
      @case ('calendar-range') {
        <svg lucideCalendarRange [size]="size()"></svg>
      }
      @case ('camera') {
        <svg lucideCamera [size]="size()"></svg>
      }
      @case ('check') {
        <svg lucideCheck [size]="size()"></svg>
      }
      @case ('circle-check') {
        <svg lucideCircleCheck [size]="size()"></svg>
      }
      @case ('circle-check-big') {
        <svg lucideCircleCheckBig [size]="size()"></svg>
      }
      @case ('chevron-down') {
        <svg lucideChevronDown [size]="size()"></svg>
      }
      @case ('chevron-left') {
        <svg lucideChevronLeft [size]="size()"></svg>
      }
      @case ('chevron-right') {
        <svg lucideChevronRight [size]="size()"></svg>
      }
      @case ('chevrons-left') {
        <svg lucideChevronsLeft [size]="size()"></svg>
      }
      @case ('chevrons-right') {
        <svg lucideChevronsRight [size]="size()"></svg>
      }
      @case ('circle') {
        <svg lucideCircle [size]="size()"></svg>
      }
      @case ('clipboard-list') {
        <svg lucideClipboardList [size]="size()"></svg>
      }
      @case ('clock') {
        <svg lucideClock [size]="size()"></svg>
      }
      @case ('cloud') {
        <svg lucideCloud [size]="size()"></svg>
      }
      @case ('code-xml') {
        <svg lucideCodeXml [size]="size()"></svg>
      }
      @case ('compass') {
        <svg lucideCompass [size]="size()"></svg>
      }
      @case ('copy') {
        <svg lucideCopy [size]="size()"></svg>
      }
      @case ('cpu') {
        <svg lucideCpu [size]="size()"></svg>
      }
      @case ('database') {
        <svg lucideDatabase [size]="size()"></svg>
      }
      @case ('dollar-sign') {
        <svg lucideDollarSign [size]="size()"></svg>
      }
      @case ('download') {
        <svg lucideDownload [size]="size()"></svg>
      }
      @case ('square-pen') {
        <svg lucideSquarePen [size]="size()"></svg>
      }
      @case ('eye') {
        <svg lucideEye [size]="size()"></svg>
      }
      @case ('eye-off') {
        <svg lucideEyeOff [size]="size()"></svg>
      }
      @case ('file-code') {
        <svg lucideFileCode [size]="size()"></svg>
      }
      @case ('file-pen') {
        <svg lucideFilePen [size]="size()"></svg>
      }
      @case ('file-text') {
        <svg lucideFileText [size]="size()"></svg>
      }
      @case ('list-filter') {
        <svg lucideListFilter [size]="size()"></svg>
      }
      @case ('git-branch') {
        <svg lucideGitBranch [size]="size()"></svg>
      }
      @case ('globe') {
        <svg lucideGlobe [size]="size()"></svg>
      }
      @case ('headphone') {
        <svg lucideHeadphones [size]="size()"></svg>
      }
      @case ('heart') {
        <svg lucideHeart [size]="size()"></svg>
      }
      @case ('refresh-cw') {
        <svg lucideRefreshCw [size]="size()"></svg>
      }
      @case ('info') {
        <svg lucideInfo [size]="size()"></svg>
      }
      @case ('key-round') {
        <svg lucideKeyRound [size]="size()"></svg>
      }
      @case ('laptop') {
        <svg lucideLaptop [size]="size()"></svg>
      }
      @case ('layers') {
        <svg lucideLayers [size]="size()"></svg>
      }
      @case ('layout-dashboard') {
        <svg lucideLayoutDashboard [size]="size()"></svg>
      }
      @case ('layout-grid') {
        <svg lucideLayoutGrid [size]="size()"></svg>
      }
      @case ('lightbulb') {
        <svg lucideLightbulb [size]="size()"></svg>
      }
      @case ('list') {
        <svg lucideList [size]="size()"></svg>
      }
      @case ('loader-circle') {
        <svg lucideLoaderCircle [size]="size()"></svg>
      }
      @case ('lock') {
        <svg lucideLock [size]="size()"></svg>
      }
      @case ('lock-keyhole') {
        <svg lucideLockKeyhole [size]="size()"></svg>
      }
      @case ('log-in') {
        <svg lucideLogIn [size]="size()"></svg>
      }
      @case ('log-out') {
        <svg lucideLogOut [size]="size()"></svg>
      }
      @case ('mail') {
        <svg lucideMail [size]="size()"></svg>
      }
      @case ('mail-check') {
        <svg lucideMailCheck [size]="size()"></svg>
      }
      @case ('map') {
        <svg lucideMap [size]="size()"></svg>
      }
      @case ('map-pin') {
        <svg lucideMapPin [size]="size()"></svg>
      }
      @case ('menu') {
        <svg lucideMenu [size]="size()"></svg>
      }
      @case ('message-square') {
        <svg lucideMessageSquare [size]="size()"></svg>
      }
      @case ('minus') {
        <svg lucideMinus [size]="size()"></svg>
      }
      @case ('monitor') {
        <svg lucideMonitor [size]="size()"></svg>
      }
      @case ('monitor-smartphone') {
        <svg lucideMonitorSmartphone [size]="size()"></svg>
      }
      @case ('ellipsis-vertical') {
        <svg lucideEllipsisVertical [size]="size()"></svg>
      }
      @case ('mountain') {
        <svg lucideMountain [size]="size()"></svg>
      }
      @case ('package') {
        <svg lucidePackage [size]="size()"></svg>
      }
      @case ('package-open') {
        <svg lucidePackageOpen [size]="size()"></svg>
      }
      @case ('palette') {
        <svg lucidePalette [size]="size()"></svg>
      }
      @case ('percent') {
        <svg lucidePercent [size]="size()"></svg>
      }
      @case ('phone') {
        <svg lucidePhone [size]="size()"></svg>
      }
      @case ('plus') {
        <svg lucidePlus [size]="size()"></svg>
      }
      @case ('save') {
        <svg lucideSave [size]="size()"></svg>
      }
      @case ('search') {
        <svg lucideSearch [size]="size()"></svg>
      }
      @case ('send') {
        <svg lucideSend [size]="size()"></svg>
      }
      @case ('server') {
        <svg lucideServer [size]="size()"></svg>
      }
      @case ('settings') {
        <svg lucideSettings [size]="size()"></svg>
      }
      @case ('shield') {
        <svg lucideShield [size]="size()"></svg>
      }
      @case ('shield-check') {
        <svg lucideShieldCheck [size]="size()"></svg>
      }
      @case ('shopping-bag') {
        <svg lucideShoppingBag [size]="size()"></svg>
      }
      @case ('shopping-cart') {
        <svg lucideShoppingCart [size]="size()"></svg>
      }
      @case ('sliders-horizontal') {
        <svg lucideSlidersHorizontal [size]="size()"></svg>
      }
      @case ('smartphone') {
        <svg lucideSmartphone [size]="size()"></svg>
      }
      @case ('sparkles') {
        <svg lucideSparkles [size]="size()"></svg>
      }
      @case ('star') {
        <svg lucideStar [size]="size()"></svg>
      }
      @case ('tablet') {
        <svg lucideTablet [size]="size()"></svg>
      }
      @case ('tag') {
        <svg lucideTag [size]="size()"></svg>
      }
      @case ('target') {
        <svg lucideTarget [size]="size()"></svg>
      }
      @case ('tent') {
        <svg lucideTent [size]="size()"></svg>
      }
      @case ('terminal') {
        <svg lucideTerminal [size]="size()"></svg>
      }
      @case ('toggle-left') {
        <svg lucideToggleLeft [size]="size()"></svg>
      }
      @case ('trash-2') {
        <svg lucideTrash2 [size]="size()"></svg>
      }
      @case ('tree-pine') {
        <svg lucideTreePine [size]="size()"></svg>
      }
      @case ('trending-down') {
        <svg lucideTrendingDown [size]="size()"></svg>
      }
      @case ('trending-up') {
        <svg lucideTrendingUp [size]="size()"></svg>
      }
      @case ('truck') {
        <svg lucideTruck [size]="size()"></svg>
      }
      @case ('upload') {
        <svg lucideUpload [size]="size()"></svg>
      }
      @case ('user') {
        <svg lucideUser [size]="size()"></svg>
      }
      @case ('user-check') {
        <svg lucideUserCheck [size]="size()"></svg>
      }
      @case ('user-plus') {
        <svg lucideUserPlus [size]="size()"></svg>
      }
      @case ('user-round') {
        <svg lucideUserRound [size]="size()"></svg>
      }
      @case ('users') {
        <svg lucideUsers [size]="size()"></svg>
      }
      @case ('wind') {
        <svg lucideWind [size]="size()"></svg>
      }
      @case ('x') {
        <svg lucideX [size]="size()"></svg>
      }
      @case ('circle-x') {
        <svg lucideCircleX [size]="size()"></svg>
      }
      @case ('zap') {
        <svg lucideZap [size]="size()"></svg>
      }
      @case ('arrow-up') {
        <svg lucideArrowUp [size]="size()"></svg>
      }
      @case ('arrow-down') {
        <svg lucideArrowDown [size]="size()"></svg>
      }
      @case ('leaf') {
        <svg lucideLeaf [size]="size()"></svg>
      }
      @case ('sun') {
        <svg lucideSun [size]="size()"></svg>
      }
      @case ('moon') {
        <svg lucideMoon [size]="size()"></svg>
      }
      @case ('flame') {
        <svg lucideFlame [size]="size()"></svg>
      }
      @case ('footprints') {
        <svg lucideFootprints [size]="size()"></svg>
      }
      @case ('mountain-snow') {
        <svg lucideMountainSnow [size]="size()"></svg>
      }
      @case ('trees') {
        <svg lucideTrees [size]="size()"></svg>
      }
      @case ('tent-tree') {
        <svg lucideTentTree [size]="size()"></svg>
      }
      @case ('box') {
        <svg lucideBox [size]="size()"></svg>
      }
      @case ('scan') {
        <svg lucideScan [size]="size()"></svg>
      }
      @case ('shield-alert') {
        <svg lucideShieldAlert [size]="size()"></svg>
      }
      @case ('hand') {
        <svg lucideHand [size]="size()"></svg>
      }
      @case ('message-square-warning') {
        <svg lucideMessageSquareWarning [size]="size()"></svg>
      }
      @default {
        <span class="icon-missing" title="Icono no encontrado"></span>
      }
    }
  `,
})
export class IconComponent {
  name = input.required<string>();
  size = input<number | string>(24);
}
