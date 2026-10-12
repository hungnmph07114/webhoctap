// ================================================================
// DỊCH VỤ PWA: QUẢN LÝ CÀI ĐẶT ỨNG DỤNG & NGOẠI TUYẾN (OFFLINE)
// ================================================================

export type InstallOutcome = 'accepted' | 'dismissed' | 'unavailable';

class PWAService {
  private deferredPrompt: any = null;
  private installableListeners: Array<(canInstall: boolean) => void> = [];
  private networkListeners: Array<(online: boolean) => void> = [];

  constructor() {
    this.initNetworkListeners();
    this.initInstallPrompt();
    this.registerServiceWorker();
  }

  // Đăng ký Service Worker
  public registerServiceWorker(): void {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            // Check for updates periodically
            reg.onupdatefound = () => {
              const installingWorker = reg.installing;
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    console.log('Phiên bản mới của Tiểu Học Vui đã sẵn sàng!');
                  }
                };
              }
            };
          })
          .catch((err) => {
            console.warn('Không thể đăng ký Service Worker:', err);
          });
      });
    }
  }

  // Lắng nghe sự kiện cài đặt từ trình duyệt
  private initInstallPrompt(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.notifyInstallable(true);
    });

    window.addEventListener('appinstalled', () => {
      this.deferredPrompt = null;
      this.notifyInstallable(false);
    });
  }

  private initNetworkListeners(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('online', () => this.notifyNetwork(true));
    window.addEventListener('offline', () => this.notifyNetwork(false));
  }

  public isOnline(): boolean {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public isStandalone(): boolean {
    if (typeof window === 'undefined') return false;
    const isStandaloneWindow = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (navigator as any).standalone === true;
    return isStandaloneWindow || isIOSStandalone;
  }

  public isIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null || (!this.isStandalone() && this.isIOS());
  }

  public async promptInstall(): Promise<InstallOutcome> {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      this.deferredPrompt = null;
      this.notifyInstallable(false);
      return outcome as InstallOutcome;
    }
    return 'unavailable';
  }

  public onInstallableChange(cb: (canInstall: boolean) => void): () => void {
    this.installableListeners.push(cb);
    cb(this.isInstallable());
    return () => {
      this.installableListeners = this.installableListeners.filter((l) => l !== cb);
    };
  }

  public onNetworkChange(cb: (online: boolean) => void): () => void {
    this.networkListeners.push(cb);
    cb(this.isOnline());
    return () => {
      this.networkListeners = this.networkListeners.filter((l) => l !== cb);
    };
  }

  private notifyInstallable(canInstall: boolean): void {
    this.installableListeners.forEach((listener) => listener(canInstall));
  }

  private notifyNetwork(online: boolean): void {
    this.networkListeners.forEach((listener) => listener(online));
  }
}

export const pwaService = new PWAService();
