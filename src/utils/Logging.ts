
export abstract class Log {

  private static log(msg: string) {
    const now = new Date()
    console.log(now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds() + '.' + now.getMilliseconds() + msg)
  }

  public static info(msg: string) {
    this.log(' [INFO] ' + msg)
  }

  public static warn(msg: string) {
    this.log(' [WARN] ' + msg)
  }

  public static error(msg: string) {
    this.log(' [ERROR] ' + msg)
  }

  public static debug(msg: string) {
    this.log(' [DEBUG] ' + msg)
  }

  public static trace(msg: string) {
    this.log(' [TRACE] ' + msg)
  }

}