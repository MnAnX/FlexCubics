package com.advicecoach.server.netty;

/**
 * Created by nanxiao on 9/3/16.
 */
public class ServerPort {
    /**
     * PortNumber - Enumerated type of some well-known ports.
     */
    public enum PortNumber {
        ECHO(7),
        FTP(21),
        SSH(22),
        TELNET(23),
        SMTP(25),
        DNS(53),
        TFTP(69),
        HTTP(8080),
        POP3(110),
        SFTP(115),
        SNMP(161),
        IRC(194),
        LDAP(389),
        HTTPS(443);

        private final int portNumber;

        public int value() {
            return portNumber;
        }

        private PortNumber(int value) {
            portNumber = value;
        }
    }
}
